
// Fields: title, place_of_origin, artist_display, inscriptions, date_start, date_end



class TableData {
  // id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  data_start: string;
  data_end: string;

  constructor(//id: number,
    title: string,
    place_of_origin: string,
    artist_display: string,
    inscriptions: string,
    data_start: string,
    data_end: string) {
    
    // this.id = id;
    this.title = title;
    this.place_of_origin = place_of_origin;
    this.artist_display = artist_display;
    this.inscriptions = inscriptions;
    this.data_start = data_start;
    this.data_end = data_end;

  }
}

export default TableData;
