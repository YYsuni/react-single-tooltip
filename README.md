react-single-tooltip is a opinionated tooltip component. It uses no dependencies. so, it is tiny yet intelligent.

## Usage

To start using the library, install it in your project:

```bash
npm install react-single-tooltip
# pnpm i react-single-tooltip
# yarn i react-single-tooltip

# canary
# or npm i react-single-tooltip@canary
# or pnpm i react-single-tooltip@canary
# or yarn i react-single-tooltip@canary
```

Add `<SingleTooltip />` to your app, it will be the place where all your tooltip will be rendered.
After that you can use `useTooltip()` hook in your component.

```jsx
import SingleTooltip, { useTooltip } from 'react-single-tooltip';
import { useRef } from 'react'

// ...

function App() {
  const ref = useRef(null)
  useTooltip(ref, "Tooltip content")
  
  return (
    <div>
      <SingleTooltip />
      <button ref={ref}>Hover me</button>
    </div>
  );
}
```

## Props

### SingleTooltip component

| Name            | Type             | Default              | Description       |
| :-------------- | :--------------- | :------------------- | :---------------- |
| backgroundColor | string           | `rgba(0, 0, 0, 0.8)` | -                 |
| zIndex          | number           | 99                   | -                 |
| borderRadius    | number           | 12                   | -                 |
| offset          | number \| string | 4                    | container padding |

### useTooltip params

You can dynamically show/hide the tooltip.

```ts
useTooltip(ref: React.RefObject<HTMLElement | SVGSVGElement>, text: string, show = true)
```