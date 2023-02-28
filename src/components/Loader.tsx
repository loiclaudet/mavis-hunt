import ContentLoader from "react-content-loader";

export const PlayerDetailsLoader = () => (
  <ContentLoader
    animate={true}
    speed={2}
    viewBox={`0 0 320 116`}
    backgroundColor="#362218"
    foregroundColor="#FDE5D2"
    backgroundOpacity={0.3}
    foregroundOpacity={0.5}
  >
    <rect x="0" y="20" rx="5" ry="5" width={200} height={20} />
    <rect x="0" y="50" rx="5" ry="5" width={300} height={20} />
    <rect x="0" y="85" rx="5" ry="5" width={112} height={25} />
  </ContentLoader>
);
