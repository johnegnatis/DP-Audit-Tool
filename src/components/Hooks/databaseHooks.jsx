import { useState, useEffect } from "react";
import { eel } from "../../utils/eel";
import { tableTypes } from "../../utils/constants";
import { handleError } from "../../utils/methods";

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
        handleError(e);
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

export function useTrackOptions(track) {
  const [coreOptions, setCoreOptions] = useState([]);
  const [followingOptions, setFollowingOptions] = useState([]);
  const [prerequisiteOptions, setPrerequisiteOptions] = useState([]);
  const [tableCounts, setTableCounts] = useState({});
  const [degreePlanNotes, setDegreePlanNotes] = useState({});
  const [nOfTheFollowing, setNOfTheFollowing] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!track) return;
    setLoading(true);
    eel
      .getFrontendOptions()()
      .then((result) => {
        const jsonResult = JSON.parse(result);
        const pdfTypes = jsonResult["pdf-types"];
        const database = jsonResult.tracks.find((dbTrack) => dbTrack.name == track);
        if (!database) throw "Track not found";
        setCoreOptions(getClassOptions(database, tableTypes.core));
        setFollowingOptions(getClassOptions(database, tableTypes.following));
        setPrerequisiteOptions(getClassOptions(database, tableTypes.prerequisites));
        setNOfTheFollowing(database["N-of-the-following"] | 0);
        setTableCounts(pdfTypes[database["pdf-type"] || "0"]["pdf-table-size"]);
        setDegreePlanNotes(database["notes"]);
        setLoading(false);
      })
      .catch((e) => {
        handleError(e);
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

  return { loading, coreOptions, followingOptions, prerequisiteOptions, nOfTheFollowing, tableCounts, degreePlanNotes };
}
