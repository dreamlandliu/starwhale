/*
 * Copyright 2022.1-2022
 * StarWhale.ai All right reserved. This software is the confidential and proprietary information of
 * StarWhale.ai ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with StarWhale.ai.
 */

package ai.starwhale.mlops.domain.job.split;

import ai.starwhale.mlops.domain.job.Job;
import ai.starwhale.mlops.domain.job.Job.JobStatus;
import ai.starwhale.mlops.domain.job.JobMapper;
import ai.starwhale.mlops.domain.storage.StoragePathCoordinator;
import ai.starwhale.mlops.domain.swds.SWDataSet;
import ai.starwhale.mlops.domain.swds.index.SWDSBlock;
import ai.starwhale.mlops.domain.swds.index.SWDSBlockSerializer;
import ai.starwhale.mlops.domain.swds.index.SWDSIndex;
import ai.starwhale.mlops.domain.swds.index.SWDSIndexLoader;
import ai.starwhale.mlops.domain.task.TaskEntity;
import ai.starwhale.mlops.domain.task.TaskMapper;
import ai.starwhale.mlops.domain.task.TaskStatus;
import ai.starwhale.mlops.domain.task.bo.Task;
import ai.starwhale.mlops.domain.task.bo.TaskBoConverter;
import ai.starwhale.mlops.exception.SWValidationException;
import ai.starwhale.mlops.exception.SWValidationException.ValidSubject;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

/**
 * split job by swds index
 */
@Slf4j
public class JobSpliteratorByIndex implements JobSpliterator {

    StoragePathCoordinator storagePathCoordinator;

    private final SWDSIndexLoader swdsIndexLoader;

    private final SWDSBlockSerializer swdsBlockSerializer;

    private final TaskMapper taskMapper;

    private final JobMapper jobMapper;

    TaskBoConverter taskBoConverter;


    public JobSpliteratorByIndex(SWDSIndexLoader swdsIndexLoader,SWDSBlockSerializer swdsBlockSerializer,TaskMapper taskMapper,JobMapper jobMapper,String storagePrefix){
        this.swdsBlockSerializer = swdsBlockSerializer;
        this.swdsIndexLoader = swdsIndexLoader;
        this.taskMapper = taskMapper;
        this.jobMapper = jobMapper;
    }

    /**
     * get all data blocks and split them by a simple random number
     * transactional jobStatus->SPLIT taskStatus->NEW
     */
    @Override
    @Transactional
    public List<Task> split(Job job) {
        final List<SWDataSet> swDataSets = job.getSwDataSets();
        Integer deviceAmount = job.getJobRuntime().getDeviceAmount();
        Random r = new Random();
        final Map<Integer,List<SWDSBlock>> swdsBlocks = swDataSets.parallelStream()
            .map(swDataSet -> swdsIndexLoader.load(swDataSet.getIndexPath()))
            .map(SWDSIndex::getSWDSBlockList)
            .flatMap(Collection::stream)
            .collect(Collectors.groupingBy(blk->r.nextInt(deviceAmount)))
            ;
        List<TaskEntity> taskList;
        try {
            taskList = buildTaskEntities(job, swdsBlocks);
        } catch (JsonProcessingException e) {
            log.error("error swds index ",e);
            throw new SWValidationException(ValidSubject.SWDS);
        }
        taskMapper.addAll(taskList);
        jobMapper.updateJobStatus(List.of(job.getId()),JobStatus.SPLIT.getValue());
        return taskBoConverter.fromTaskEntity(taskList,job);
    }

    private List<TaskEntity> buildTaskEntities(Job job, Map<Integer, List<SWDSBlock>> swdsBlocks)
        throws JsonProcessingException {
        List<TaskEntity> taskEntities = new LinkedList<>();
        for(int i=0;i<job.getJobRuntime().getDeviceAmount();i++){
            final String taskUuid = UUID.randomUUID().toString();
            taskEntities.add(TaskEntity.builder()
                .jobId(job.getId())
                .resultPath(storagePath(job.getUuid(),taskUuid))
                .swdsBlocks(swdsBlockSerializer.toString(swdsBlocks.get(i)))
                .taskStatus(TaskStatus.CREATED.getOrder())
                .taskUuid(taskUuid)
                .build());
        }
        return taskEntities;
    }

    private String storagePath(String jobId,String taskId) {
        return storagePathCoordinator.taskResultPath(jobId,taskId);
    }
}
