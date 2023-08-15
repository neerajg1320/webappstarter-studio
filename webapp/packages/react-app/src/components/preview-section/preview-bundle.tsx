import "./preview-bundle.css";
interface PreviewBundleProps {
  bundle: string;
}

const PreviewBundle:React.FC<PreviewBundleProps> = ({bundle}) => {
  return (
    <div className="preview-bundle-wrapper">
      <pre style={{width: "100%", backgroundColor: "white"}}>
        {bundle}
      </pre>
    </div>
  );
}

export default PreviewBundle;