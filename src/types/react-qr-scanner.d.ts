declare module 'react-qr-scanner' {
    import { Component } from 'react';
  
    interface QrReaderProps {
      delay?: number | false;
      onError: (error: any) => void;
      onScan: (data: { text: string } | null) => void;
      style?: React.CSSProperties;
      constraints?: MediaStreamConstraints; 
      className?: string;
    }
  
    class QrReader extends Component<QrReaderProps> {}
    export default QrReader;
  }