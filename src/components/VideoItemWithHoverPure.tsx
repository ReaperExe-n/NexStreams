import { PureComponent, ForwardedRef, forwardRef } from "react";

type VideoItemWithHoverPureType = {
  src: string;
  innerRef: ForwardedRef<HTMLDivElement>;
  handleHover: (value: boolean) => void;
  progress?: number;
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
