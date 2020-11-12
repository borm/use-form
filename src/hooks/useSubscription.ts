import { flatten } from 'nest-deep';
import { useEffect, useState } from 'react';
import { FormState } from '../api';
import isEqual from '../helpers/isEqual';

type SubscriptionProps = {
  getState: () => FormState;
  subscribe: (checkForUpdates: () => void) => any;
};

export default function useSubscription({ getState, subscribe }: SubscriptionProps) {
  const [state, setState] = useState(getState());

  useEffect(() => {
    let didUnsubscribe = false;

    const checkForUpdates = () => {
      if (didUnsubscribe) {
        return;
      }

      const nextState = getState();
      return setState((prevState: FormState) => {
        if (isEqual(flatten(state), flatten(nextState))) {
          return prevState;
        }

        return nextState;
      });
    };
    checkForUpdates();
    const unsubscribe = subscribe(checkForUpdates);

    return () => {
      didUnsubscribe = true;
      unsubscribe();
    };
  }, [subscribe]);
  return state;
}
