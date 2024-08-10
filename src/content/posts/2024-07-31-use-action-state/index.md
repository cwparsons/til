---
title: useActionState alternative with React
description: An
pubDate: 2024-08-01
tags: ['react']
---

[`useActionState`](https://react.dev/reference/react/useActionState) is currently in the canary channel of React. I want to use this for a new Next.js site, but I can't switch to the canary channel without causing breaking issues to other areas of the site. Instead, I'm using this alternative. It doesn't support the permalink parameter yet, but I'm not leveraging that part yet.

```typescript
/** use-action-state.ts */
import { useState, useTransition } from 'react';

export function useActionState<State, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State>,
  _permalink?: string,
): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean] {
  const [state, setState] = useState<Awaited<State>>(initialState);
  const [isPending, startTransition] = useTransition();

  const submitAction = async (payload: Payload) => {
    startTransition(async () => {
      const _state = await action(state, payload);
      setState(_state);
    });
  };

  return [state, submitAction, isPending];
}
```
