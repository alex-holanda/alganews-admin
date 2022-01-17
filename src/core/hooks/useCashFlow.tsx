import { useState, useCallback } from 'react';

import { Key } from 'antd/lib/table/interface';

import moment from 'moment';

import { CashFlow, CashFlowService } from 'alex-holanda-sdk';

type CashFlowEntryType = CashFlow.EntrySummary['type'];

function useCashFlow(type: CashFlowEntryType) {
  const [entries, setEntries] = useState<CashFlow.EntrySummary[]>([]);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const [query, setQuery] = useState<CashFlow.Query>({
    type,
    sort: ['transactedOn', 'desc'],
    yearMonth: moment().format('YYYY-MM'),
  });
  const [selected, setSelected] = useState<Key[]>([]);

  const fetchEntries = useCallback(async () => {
    try {
      setFetchingEntries(true);

      const newEntries = await CashFlowService.getAllEntries(query);
      setEntries(newEntries);
    } finally {
      setFetchingEntries(false);
    }
  }, [query]);

  const deleteEntriesInBatch = useCallback(async (ids: number[]) => {
    try {
      setFetchingEntries(true);
      await CashFlowService.removeEntriesBatch(ids);
    } finally {
      setFetchingEntries(false);
    }
  }, []);

  return {
    entries,
    fetchingEntries,
    fetchEntries,
    query,
    setQuery,
    selected,
    setSelected,
    deleteEntriesInBatch,
  };
}

export default useCashFlow;
