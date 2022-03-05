import { RootState } from 'core/store';
import { setBreadcrumb } from 'core/store/UI.slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useBreadcrumb(newBreadcrumb?: string) {
  const dispatch = useDispatch();

  const breadcrumb = useSelector((state: RootState) => state.ui.breadcrumb);

  useEffect(() => {
    if (newBreadcrumb) {
      dispatch(setBreadcrumb(newBreadcrumb.split('/')));
    }
  }, [dispatch, newBreadcrumb]);

  return {
    breadcrumb,
  };
}
