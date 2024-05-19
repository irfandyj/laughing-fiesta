import Comment from "@/components/molecules/Comment";

import './RoomDetailPageMessageView.module.css';

/**
 * Scrollable message view for the room detail page.
 * @returns 
 */
const RoomDetailPageMessageView = () => {
  return (
    <div className="RoomDetailPageMessageView">
      <Comment />
      <Comment />
      <Comment>
        <Comment />
        <Comment>
          <Comment />
        </Comment>
        <Comment />
      </Comment>
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </div>
  );
};

export default RoomDetailPageMessageView;