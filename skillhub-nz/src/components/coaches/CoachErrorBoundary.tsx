'use client';

import { Component, ReactNode } from 'react';
import { CoachErrorDisplay } from './CoachErrorDisplay';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CoachErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('教练页面错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <CoachErrorDisplay />;
    }

    return this.props.children;
  }
}

