local function aggregate_records(aggregate, rec)
    aggregate = aggregate + 1
  
    return aggregate
end

function record_count(s)
    return s : aggregate(0, aggregate_records)
end