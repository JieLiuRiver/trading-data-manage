import { STORAGE_HIGHLIGHT_KEY } from '@/constants';
import { useLocalStorageState } from 'ahooks';

const useHighlightIds = () => {
  const [highlightIdsMap, setHighlightIdsMap] = useLocalStorageState<
    Record<string, boolean>
  >(STORAGE_HIGHLIGHT_KEY, {
    defaultValue: {},
  });

  return {
    highlightIdsMap,
    setHighlightIdsMap,
  };
};

export default useHighlightIds;
