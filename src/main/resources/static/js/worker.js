self.onmessage = function(event) {
    const detections = event.data;

    // 데이터 변환 또는 처리
    const processedData = detections.map(detection => ({
        ...detection,
        additionalField: detection.riskLevel === 'HIGH' ? 'Urgent' : 'Normal'
    }));

    // 처리된 데이터 반환
    self.postMessage(processedData);
};
