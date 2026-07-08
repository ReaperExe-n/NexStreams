import { PureComponent, ForwardedRef, forwardRef } from "react";

type VideoItemWithHoverPureType = {
  src: string;
  innerRef: ForwardedRef<HTMLDivElement>;
  handleHover: (value: boolean) => void;
  progress?: number;
  title?: string;
};

class VideoItemWithHoverPure extends PureComponent<VideoItemWithHoverPureType> {
  render() {
    return (
      <div
        ref={this.props.innerRef}
        style={{
          zIndex: 9,
          cursor: "pointer",
          borderRadius: 0.5,
          width: "100%",
          position: "relative",
          paddingTop: "calc(9 / 16 * 100%)",
          overflow: "hidden", // ensures progress bar stays within bounds
        }}
      >
        <img
          src={this.props.src}
          style={{
            top: 0,
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            borderRadius: "4px",
            width: "100%",
          }}
          onPointerEnter={() => {
            this.props.handleHover(true);
          }}
          onPointerLeave={() => {
            this.props.handleHover(false);
          }}
        />
        {this.props.title && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              padding: this.props.progress !== undefined ? "20px 10px 15px 10px" : "20px 10px 10px 10px",
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
              color: "white",
              fontSize: "1rem",
              fontWeight: 700,
              textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "flex-end",
              boxSizing: "border-box",
              textTransform: "uppercase",
              fontFamily: "Netflix Sans, Helvetica Neue, Helvetica, Arial, sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {this.props.title}
          </div>
        )}
        {this.props.progress !== undefined && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "4px",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "#e50914",
                width: `${this.props.progress}%`,
                borderBottomLeftRadius: "4px",
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

const VideoItemWithHoverRef = forwardRef<
  HTMLDivElement,
  Omit<VideoItemWithHoverPureType, "innerRef">
>((props, ref) => <VideoItemWithHoverPure {...props} innerRef={ref} />);
VideoItemWithHoverRef.displayName = "VideoItemWithHoverRef";

export default VideoItemWithHoverRef;
