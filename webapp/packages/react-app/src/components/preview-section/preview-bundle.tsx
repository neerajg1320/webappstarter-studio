interface PreviewBundleProps {
  bundle: string;
}

const PreviewBundle:React.FC<PreviewBundleProps> = ({bundle}) => {
  return (
    <div className="preview-bundle-wrapper">
      <pre>
        {bundle}
      </pre>
    </div>
  );
}

export default PreviewBundle;