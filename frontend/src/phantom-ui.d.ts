import * as React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'phantom-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        loading?: 'true' | 'false' | boolean | string;
      }, HTMLElement>;
    }
  }
}
