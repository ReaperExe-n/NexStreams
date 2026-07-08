import { useEffect, useState, useRef } from "react";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import VideoItemWithHoverPure from "./VideoItemWithHoverPure";

interface VideoItemWithHoverProps {
  video: Movie;
  progress?: number;
}

export default function VideoItemWithHover({ video, progress }: VideoItemWithHoverProps) {
  const setPortal = usePortal();
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { data: configuration } = useGetConfigurationQuery(undefined);

  useEffect(() => {
    if (isHovered) {
      timeoutRef.current = setTimeout(() => {
        setPortal(elementRef.current, video);
      }, 400); // 400ms delay to prevent flashing when moving mouse quickly
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, setPortal, video]);

  return (
    <VideoItemWithHoverPure
      ref={elementRef}
      handleHover={setIsHovered}
      src={`${configuration?.images.base_url}w300${video.backdrop_path}`}
      progress={progress}
      title={video.title || video.name || video.original_title}
    />
  );
}
