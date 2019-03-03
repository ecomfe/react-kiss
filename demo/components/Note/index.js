import {compose} from 'recompose';
import {joinAll} from 'react-kiss';
import {establishNote, joinNote, joinGlobal} from '@/regions';

const Note = ({username, visible, message, onToggle}) => (
    <div style={{marginTop: 20}}>
        <button type="button" onClick={onToggle}>
            {visible ? 'Hide' : 'Show'}
        </button>
        {visible && <p style={{fontSize: 48, fontWeight: 'bold', textAlign: 'center'}}>{message} @ {username}</p>}
    </div>
);

const mapToProps = (note, global) => {
    const message = note.notes[global.username];

    return {
        username: global.username,
        message: message,
        visible: note.visible,
        onToggle: note.toggle,
    };
};

const enhance = compose(
    establishNote('Note'),
    joinAll(joinNote, joinGlobal, mapToProps)
);

export default enhance(Note);
