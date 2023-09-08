interface PreviewErrorProps {
  err: string;
}

const PreviewBuild:React.FC<PreviewErrorProps> = ({err}) => {
  return (
      <div className={err !== '' ? "preview-error" : "preview-success"}>
        {err !== '' ? err : 'Code Bundled Successfully!'}
      </div>
  );
}

export default PreviewBuild;