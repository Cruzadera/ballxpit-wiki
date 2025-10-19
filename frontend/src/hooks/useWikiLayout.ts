import { useOutletContext } from 'react-router-dom';
import type { WikiLayoutContext } from '../components/wiki/WikiLayout';

export function useWikiLayout() {
  return useOutletContext<WikiLayoutContext>();
}
