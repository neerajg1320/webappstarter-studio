interface PreviewErrorProps {
  err: string;
}

const PreviewBuild:React.FC<PreviewErrorProps> = ({err}) => {
  return (
      <div className="preview-error">
        {err ? err : 'Build Sucessful'}
      </div>
  );
}

export default PreviewBuild;