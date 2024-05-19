import './RoomDetailPageMessageInput.module.css'

const RoomDetailPageMessageInput = () => {
  return (
    <div className="RoomDetailPageMessageInput">
      <form className="RoomDetailPageMessageInput__form">
        <textarea className="RoomDetailPageMessageInput__input" />
        <button className="RoomDetailPageMessageInput__submit-btn" type='submit'>Send</button>
      </form>
    </div>
  );
}

export default RoomDetailPageMessageInput;