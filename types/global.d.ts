type TGetLayout = (page: React.ReactNode) => React.ReactNode;

interface ISvgComponentProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  viewBox?: string;
  opacity?: string | number;
  className?: string;
}

type IComponent<T = object> = React.FC<React.PropsWithChildren<T>>;
interface IPageComponent<T = object> extends IComponent<T> {
  getLayout?: TGetLayout;
}
type ISvgComponent<T = object> = IComponent<ISvgComponentProps & T>;

type TAny = ReturnType<JSON.values>;
