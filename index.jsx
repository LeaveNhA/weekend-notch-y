import { React } from 'uebersicht';
import styles from "./lib/styles.jsx";

const useState = React.useState;
const useEffect = React.useEffect;

const debugFlag = true;

export const refreshFrequency = debugFlag ? 3000 : 1 * 60 * 1000;

export const command = "./notch/scripts/musicstatus.sh";

const Styles = () => <style>{`
.island-container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3.55cm;
  height: 2.005cm;
  background-color: black;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
  transition: all 0.5s ease;
}

.island-content {
  justify-content: center;
  align-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
  color: white;
}

.island-container.expanded-for-notification {
  width: 15%;
  height: 15%;
  border-radius: 10px;
}

.island-container.expanded-for-music {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 40%;
  border-radius: 10px;
}

.island-container.expanded .island-content {
  opacity: 1;
}
`}</style>;

const DynamicIsland = ({ children, type}) => {

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(true);
        const timer = setTimeout(() => setIsExpanded(false), 3000);
        return () => clearTimeout(timer);
    }, [children]);

    console.info('@DynamicIsland:' + isExpanded);

    return (
        <div>
          <Styles />
          <div className={`island-container${isExpanded && type ? ' expanded-for-' + type : ' '}${isExpanded ? ' expanded' : ' '}`}>
            <div className="island-content">{children}</div>
          </div>
        </div>
    );
};

const parse = data => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return undefined;
    }
};

const MusicNotificationIsland = ({ song, artist, albumArt }) => {
    const StylesMusicIsland = () => <style>{`
.music-notification {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 5px;
}

.album-art {
  width: clamp(0.01%, 3.5%, 10%);
  object-fit: cover;
  aspect-ratio: 1/1;
}

.music-info {
  display: flex;
  flex-direction: row;
  gap: 5px;
  fontFamily: ${styles.fontFamily};
  color: ${styles.palette[0]};
}

.song-title {
  font-size: clamp(0.1rem, -0.875rem + 8.333vw, 1rem);
  margin: 0;
}

.artist-name {
  font-size: clamp(0.1rem, -0.875rem + 8.333vw, 1rem);
  margin: 0;
}
`}</style>;

    return (
        <div>
          <StylesMusicIsland />

          <DynamicIsland key={song} type="music">
            <div className="music-notification">
              <div className="music-info">
                <p className="artist-name">{artist} - </p>
                <p className="song-title">{song}</p>
              </div>
              <img className="album-art" src={albumArt} alt="Album Art" />
            </div>
          </DynamicIsland>
        </div>
    );
};

export const render = ({ output }) => {
    const data = parse(output);

    if(!data)
        return null;

    const styleObject = {display: 'flex',
                         position: 'fixed',
                         top: '0',
                         left: '50%'};

    /*
      const Content = () => <span>{data}</span>;
      let isExpanded = true;
      console.info("before the settimeout:" + isExpanded);

      <DynamicIsland key={data} type={"notification"}>
      <Content />
      </DynamicIsland>
      */

    return (
        <div style={styleObject}>
          {data.spotify && data.spotify.song &&
           <MusicNotificationIsland song={data.spotify.song} artist={data.spotify.artist} albumArt={data.spotify.albumArt} />}
        </div>
    );
};
