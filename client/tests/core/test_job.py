import random
from pathlib import Path
from unittest.mock import patch, MagicMock

from pyfakefs.fake_filesystem_unittest import TestCase

from starwhale.consts import RunStatus
from starwhale.core.job.step import Step, StepResult
from starwhale.core.job.task import TaskResult
from starwhale.core.job.scheduler import Scheduler


class JobTestCase(TestCase):
    def setUp(self):
        self.setUpPyfakefs()

    def test_dag_generator(self):
        # with cycle error
        with self.assertRaises(RuntimeError):
            Step.generate_dag(
                [
                    Step(
                        job_name="default",
                        name="ppl-1",
                        resources=[],
                        needs=["cmp"],
                    ),
                    Step(
                        job_name="default",
                        name="ppl-2",
                        resources=[],
                        needs=["ppl-1"],
                    ),
                    Step(
                        job_name="default",
                        name="cmp",
                        resources=[],
                        needs=["ppl-2"],
                    ),
                ]
            )

        _dag = Step.generate_dag(
            [
                Step(
                    job_name="default",
                    name="ppl-1",
                    resources=[],
                    needs=[],
                ),
                Step(
                    job_name="default",
                    name="ppl-2",
                    resources=[],
                    needs=["ppl-1"],
                ),
                Step(
                    job_name="default",
                    name="cmp",
                    resources=[],
                    needs=["ppl-2"],
                ),
            ]
        )
        assert len(_dag.all_starts()) == 1
        assert len(_dag.all_terminals()) == 1
        assert _dag.in_degree("ppl-1") == 0
        assert _dag.in_degree("ppl-2") == 1
        assert _dag.in_degree("cmp") == 1

    def test_step_result(self):
        _task_results = list(TaskResult(i, RunStatus.SUCCESS) for i in range(3))
        _step_result = StepResult("ppl-test", _task_results)
        self.assertEqual(_step_result.status, RunStatus.SUCCESS)

        _task_results.append(TaskResult(6, RunStatus.FAILED))
        _step_result = StepResult("ppl-test2", _task_results)
        self.assertEqual(_step_result.status, RunStatus.FAILED)

    def test_scheduler_cycle_exception(self):
        with self.assertRaises(RuntimeError):
            Scheduler(
                project="self",
                version="fdsie8rwe",
                workdir=Path(),
                dataset_uris=["mnist/version/tu788", "mnist/version/tu789"],
                steps=[
                    Step(
                        job_name="default",
                        name="ppl",
                        resources=[{"type": "cpu", "limit": 1, "request": 1}],
                        concurrency=1,
                        task_num=2,
                        # cycle point
                        needs=["cmp"],
                    ),
                    Step(
                        job_name="default",
                        name="cmp",
                        resources=[{"type": "cpu", "limit": 1, "request": 1}],
                        concurrency=1,
                        task_num=2,
                        needs=["ppl"],
                    ),
                ],
            )

    @patch("starwhale.core.job.task.TaskExecutor.execute")
    def test_scheduler(self, m_task_execute: MagicMock):
        m_task_execute.return_value = TaskResult(
            id=random.randint(0, 10), status=RunStatus.SUCCESS
        )

        _scheduler = Scheduler(
            project="self",
            version="fdsie8rwe",
            workdir=Path(),
            dataset_uris=["mnist/version/tu788", "mnist/version/tu789"],
            steps=[
                Step(
                    job_name="default",
                    name="ppl",
                    resources=[{"type": "cpu", "limit": 1, "request": 1}],
                    concurrency=1,
                    task_num=2,
                    needs=[],
                ),
                Step(
                    job_name="default",
                    name="cmp",
                    resources=[{"type": "cpu", "limit": 1, "request": 1}],
                    concurrency=1,
                    task_num=1,
                    needs=["ppl"],
                ),
            ],
        )
        _results = _scheduler._schedule_all()
        assert m_task_execute.call_count == 3
        self.assertEqual(
            all([_rt.status == RunStatus.SUCCESS for _rt in _results]), True
        )

        m_task_execute.reset_mock()
        _single_result = _scheduler._schedule_one_task("ppl", 0)

        assert m_task_execute.call_count == 1
        self.assertEqual(_single_result.status, RunStatus.SUCCESS)

        m_task_execute.reset_mock()
        _single_result = _scheduler._schedule_one_step("ppl")

        assert m_task_execute.call_count == 2
        self.assertEqual(_single_result.status, RunStatus.SUCCESS)
