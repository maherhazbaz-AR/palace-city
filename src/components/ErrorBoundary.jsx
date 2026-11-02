import { Component } from 'react'
import { ErrorPage } from './StatusPage'

/** Catches errors thrown while rendering and shows a friendly page instead of a blank screen. */
export default class ErrorBoundary extends Component {
  state = { failed: false, resetKey: this.props.resetKey }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  // Navigating to another page clears a previous failure.
  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.resetKey ? { failed: false, resetKey: props.resetKey } : null
  }

  componentDidCatch(error, info) {
    console.error('Page failed to render:', error, info.componentStack)
  }

  render() {
    return this.state.failed ? <ErrorPage /> : this.props.children
  }
}
