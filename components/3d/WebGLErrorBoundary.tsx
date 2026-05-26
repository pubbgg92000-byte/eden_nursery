"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { WebGLFallback } from "./WebGLFallback";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("WebGL Error caught by boundary:", error, errorInfo);
    // Check if it's a WebGL related error
    if (error.message.includes("WebGL") || error.message.includes("context")) {
      this.setState({ hasError: true });
    }
  }

  public render() {
    if (this.state.hasError) {
      return <WebGLFallback />;
    }

    return this.props.children;
  }
}
