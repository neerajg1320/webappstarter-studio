import './preview-build.css';

interface PreviewErrorProps {
  err: string;
}

const PreviewBuild:React.FC<PreviewErrorProps> = ({err}) => {
  return (
      <div className="preview-build">
        <span className={(err !== '' ? "error" : "success")}>
          {err !== '' ? err : 'Code Bundled Successfully!'}
        </span>
      </div>
  );
}

export default PreviewBuild;