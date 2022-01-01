import { CircularProgress } from "@mui/material";

const MainContentLoader = () => {
  return (
    <div style={{ 
      textAlign: 'center',
      padding: '2em 0 0', }}>
      <CircularProgress />
    </div>
  );
}

export default MainContentLoader;