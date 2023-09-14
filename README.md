react-single-tooltip is a opinionated tooltip component. It uses no dependencies. so, it is tiny yet intelligent.

## Usage

To start using the library, install it in your project:

```bash
npm install react-single-tooltip
```

Add `<SingleTooltip />` to your app, it will be the place where all your tooltip will be rendered.
After that you can use `useTooltip()` hook in your component.

```jsx
import { useTooltipRef, SingleTooltip } from 'react-single-tooltip';

function App() {
  const ref = useTooltipRef("Tooltip content")
  
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

| Name            | Type             | Default                    | Description         |
| :-------------- | :--------------- | :------------------------- | :------------------ |
| backgroundColor | string           | `rgba(0, 0, 0, 0.8)`       | -                   |
| zIndex          | number           | 99                         | -                   |
| borderRadius    | number           | 12                         | -                   |
| offset          | number \| string | 4                          | container padding   |
| padding         | number \| string | 12                         | content padding     |
| fontSize        | number \| string | 14                         | -                   |
| fontWeight      | number \| string | 400                        | -                   |
| color           | string           | `white`                    | -                   |
| maxWidth        | number \| string | `360px`(`200px` in mobile) | -                   |
| trangleWidth    | number           | 16                         | the bottom triangle |
| trangleHeight   | number           | 6                          | the bottom triangle |

### useTooltip params

| Name | Type    | Default   | Description |
| :--- | :------ | :-------- | :---------- |
| text | string  | undefined | required    |
| show | boolean | true      | -           |