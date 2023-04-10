import { useState, useEffect } from "react";
import { eel } from "../../utils/eel";
import { tableTypes } from "../../utils/constants";

export function useDatabase() {
  const [trackOptions, setTrackOptions] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    eel
      .getFrontendOptions()()
      .then((result) => {
        const jsonResult = JSON.parse(result);
        const database = jsonResult.tracks;
        setTrackOptions(formulateTrackOptions(database));
        setLoading(false);
      })
      .catch((e) => {
        console.log(e, "error at database fetch");
        setLoading(false);
      });
  }, []);

  function formulateTrackOptions(database) {
    return database.map((track, index) => {
      return {
        label: track.name,
        key: index.toString(),
      };
    });
  }

  return { loading, trackOptions };
}

export function useClassOptions(track) {
  const [coreOptions, setCoreOptions] = useState([]);
  const [followingOptions, setFollowingOptions] = useState([]);
  const [prerequisiteOptions, setPrerequisiteOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!track) return;
    setLoading(true);
    eel
      .getFrontendOptions()()
      .then((result) => {
        const jsonResult = JSON.parse(result);
        const database = jsonResult.tracks.find((dbTrack) => (dbTrack.name = track));
        if (!database) throw "Track not found";
        setCoreOptions(getClassOptions(database, tableTypes.core));
        setFollowingOptions(getClassOptions(database, tableTypes.following));
        setPrerequisiteOptions(getClassOptions(database, tableTypes.prerequisites));
        setLoading(false);
      })
      .catch((e) => {
        console.log(e, "error at database fetch");
        setLoading(false);
      });
  }, [track]);

  function getClassOptions(database, tableType) {
    const classes = database[tableType];
    if (!classes) return [];
    return classes.map((obj) => {
      return {
        name: obj.name,
        number: obj.id,
      };
    });
  }

  return { loading, coreOptions, followingOptions, prerequisiteOptions };
}
