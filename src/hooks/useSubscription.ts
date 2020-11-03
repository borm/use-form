import { flatten } from 'nest-deep';
import { useEffect, useState } from 'react';
import isEqual from '../helpers/isEqual';

type SubscriptionProps = {
  getState: () => any;
  subscribe: (checkForUpdates: () => void) => any;
};

export default function useSubscription(props: SubscriptionProps) {
  const { getState, subscribe } = props;
  const [state, setState] = useState(getState());

  useEffect(() => {
    let didUnsubscribe = false;

    const checkForUpdates = () => {
      if (didUnsubscribe) {
        return;
      }

      return setState((prevState: object) => {
        const nextState = getState();
        if (isEqual(flatten(prevState), flatten(nextState))) {
          return prevState;
        }

        return nextState;
      });
    };
    const unsubscribe = subscribe(checkForUpdates);

    checkForUpdates();

    return () => {
      didUnsubscribe = true;
      unsubscribe();
    };
  }, [subscribe]);
  return state;
}
