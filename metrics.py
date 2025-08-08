# metrics.py
metrics = {
    "total_requests": 0,
    "failed_requests": 0,
    "latencies": [],
    "queue_length": 0  # Simulated queue
}

def log_request(start_time, success=True):
    import time
    end_time = time.time()
    latency = (end_time - start_time) * 1000  # ms

    metrics["total_requests"] += 1
    if not success:
        metrics["failed_requests"] += 1
    metrics["latencies"].append(latency)

def get_metrics():
    total = metrics["total_requests"]
    failed = metrics["failed_requests"]
    avg_latency = (
        sum(metrics["latencies"]) / len(metrics["latencies"])
        if metrics["latencies"] else 0
    )
    error_rate = (failed / total) * 100 if total else 0
    return {
        "queue_length": metrics["queue_length"],
        "total_requests": total,
        "error_rate": round(error_rate, 2),
        "avg_latency_ms": round(avg_latency, 2)
    }
