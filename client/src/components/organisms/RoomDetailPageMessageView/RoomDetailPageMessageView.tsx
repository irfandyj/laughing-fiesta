/**
 * Scrollable message view for the room detail page.
 * @returns 
 */
const RoomDetailPageMessageView = () => {
  return (
    <div className="RoomDetailPageMessageView">
      <ul className="RoomDetailPageMessageView__list">
        <li className="RoomDetailPageMessageView__item">
          <div className="RoomDetailPageMessageView__message">
            <p>Message 1</p>
          </div>
        </li>
        <li className="RoomDetailPageMessageView__item">
          <div className="RoomDetailPageMessageView__message">
            <p>Message 2</p>
          </div>
        </li>
        <li className="RoomDetailPageMessageView__item">
          <div className="RoomDetailPageMessageView__message">
            <p>Message 3</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RoomDetailPageMessageView;