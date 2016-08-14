import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import bindClosures from "react-bind-closures";
import { DragSource } from "react-dnd";
import cx from "classnames";

import { videoListLoad } from "../../reducers/Video";
import { playlistTrackAdd } from "../../reducers/Playlist";

import { formatTime } from "../../lib/utils";

import "./style.styl";

const trackSource = {
  beginDrag(props, monitor, component) {
    return props.track;
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }

    const track = monitor.getItem();
    const playlist = monitor.getDropResult();

    component.props.playlistTrackAdd(playlist.id, track);

    console.log(track, playlist);
  },
};

function collect(conn, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: conn.dragSource(),
    connectDragPreview: conn.dragPreview(),
  };
}

const ListItem = connect((state) => ({
  isPlaying: state.Video.state === "play",
  index: state.Video.playlistIndex,
}), { videoListLoad, playlistTrackAdd }, (stateProps, dispatchProps, ownProps) => ({
  ...dispatchProps,
  ...ownProps,
  isPlaying: stateProps.isPlaying && ownProps.index === stateProps.index && ownProps.isInCurrentPlaylist,
}))(DragSource("TRACK", trackSource, collect)(bindClosures({
  onClick(props) {
    props.videoListLoad(props.playlistId, props.index);
  },
})(props => props.connectDragSource(
  <li className={cx("ListItem", { active: props.isPlaying })}>
    <button className="ListItem-button" onClick={props.onClick}>
      <svg viewBox="0 0 16 16">
        {props.isPlaying ? <path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z" /> : <path d="M4.5 2l10 6-10 6z" />}
      </svg>
    </button>
    <Link to={`/${props.track.key}`} className="ListItem-title">{props.track.artist} - {props.track.name}</Link>
    <div>{formatTime(props.track.duration)}</div>
  </li>, { dropEffect: "copy" }
))));

const List = connect(state => ({
  loading: state.Playlist.loading,
  playlist: state.Playlist.playlists.find(list => list.id === +state.router.params.id),
  isInCurrentPlaylist: state.Playlist.playlist.id === +state.router.params.id,
}))(props => (
  <div className="List page">
    <div className="List-title header-title">{props.playlist && props.playlist.name}</div>
    <ul>
      {!props.loading && props.playlist && props.playlist.tracks.map((track, i) => (
        <ListItem
          key={i}
          index={i}
          track={track}
          playlistId={props.playlist.id}
          isInCurrentPlaylist={props.isInCurrentPlaylist}
        />
      ))}
      {!props.loading && props.playlist && props.playlist.tracks.length === 0 && <li className="ListItem">Nothing here yet...</li>}
      {!props.loading && !props.playlist && <li className="ListItem">Could not find playlist</li>}
      {props.loading && [1, 2, 3, 4].map((v, i) => <li key={i} className="ListItem"><div className="loading" /></li>)}
    </ul>
  </div>
));

export default List;
