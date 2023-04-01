// Styles
import { useRef } from 'react';

// Styles
import styles from './Spinner.module.scss';

// Hooks
import { useDimensions } from '../../../../hooks/useDimensions';

type Props = {
  className?: string;
}

/**
 * Component used to display a spinner
 * 
 * It uses the CSS variable --width to make it fully responsive:
 * the spinner border width depends on the container size.
 */
const Spinner: React.FC<Props> = ({className}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(ref);

  return (
    <div ref={ref} style={{
      '--width': `${width}px`,
    } as React.CSSProperties} className={`${styles.spinner} ${className || ''}`}>
    </div>
  );
};

export default Spinner;