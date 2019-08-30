/**
 * Duration and Lap Calculations
 * Matthew Leingang (https://github.com/leingang)
 * 2018-09-15
 * 
 * I want to be able to enter the number of laps and get the duration,
 * or the duration and get the number of laps.  To go one way only
 * requires a formula, but to go both ways requires a script.
 *
 * Changelog
 * ---------
 *
 * 2019-07-22 Fixed a bug that prevented totalling the duration column
              Removed dependence on some constants
 * 
 * 2018-09-15 Working
 */

/**
 * @OnlyCurrentDoc Limits the script to only accessing the current sheet.
 */

/**
 * Constants
 * 
 * These are the column indices of various fields.  
 * Note A=1, B=2, etc.
 */
PACE_MIN_COLUMN = 3;
PACE_SEC_COLUMN = 4;

/**
 * Duration of a segment in minutes
 * 
 * @param nlaps number of laps run
 * @param pace  pace in minutes per lap
 */
function duration(nlaps, pace) {
  return pace * nlaps;
}

/**
 * Length of a segment in laps
 * 
 * @param dur  duration in minutes
 * @param pace pace in minutes per lap
 */
function laps(dur, pace) {
  return duration/pace; 
}

/**
 * Decide if range1 is contained in range2
 *
 * @param r1 range
 * @param r2 range
 *
 * @return bool
 *
 **/
function is_contained_in(range1,range2) {
  // Logger.log('range1: ' + range1.getRow() + ' ' + range1.getColumn() + ' ' + range1.getLastRow() + ' ' + range1.getLastColumn());
  // Logger.log('range2: ' + range2.getRow() + ' ' + range2.getColumn() + ' ' + range2.getLastRow() + ' ' + range2.getLastColumn());
  if (range1.getRow() >= range2.getRow()
          && range1.getLastRow() <= range2.getLastRow()
          && range1.getColumn() >= range2.getColumn()
          && range1.getLastColumn() <= range2.getLastColumn()) {
    // Logger.log('range1 is in range2');
    return true;
  }
  else {
    // Logger.log('range1 is not in range2');
    return false;
  }      
}

/**
 * Get the header cell for a range
 * 
 * @param r range
 **/
function range_header(r) {
  var col = r.getColumn();
  var sheet = r.getSheet();
  return sheet.getRange(1,col);
}

/**
 * Determine if a range refers to a number of laps
 * 
 * @param range range
 **/
function range_is_laps(range) {
  target_range = range.getSheet().getRange('Reps');
  if (is_contained_in(range,target_range)) {
      Logger.log('Range ' + range.getA1Notation() + ' is a lap count');
      return true;
  }
  else {
      Logger.log('Range ' + range.getA1Notation() + ' is not a lap count');
      return false;
  }
}

/**
 * Determine if a range refers to a time duration
 * 
 * @param range range
 **/
function range_is_duration(range) {
  target_range = range.getSheet().getRange('Durations');
  if (is_contained_in(range,target_range)) {
      Logger.log('Range ' + range.getA1Notation() + ' is a duration');
      return true;
  }
  else {
      Logger.log('Range ' + range.getA1Notation() + ' is not a duration');
      return false;
  }
}

/**
 * Get the pace value from a row, in minutes per lap
 *
 * @param r range
 */
function pace(r) {
  // TODO: make this update automatically by searching for the header text
  // right now, too lazy
  var nrow = r.getRow();
  var sheet = r.getSheet();
  var pace_min = sheet.getRange(nrow,PACE_MIN_COLUMN).getValue();
  var pace_sec = sheet.getRange(nrow,PACE_SEC_COLUMN).getValue();
  var answer = pace_min + pace_sec/60.0
  Logger.log('The pace associated to row ' + nrow + ' is ' + answer);
  return answer;
}

/**
 * Get the cell of a row that corresponds to the duration
 * 
 * @param r range
 */
function row_duration(r) {
  var sheet = r.getSheet();
  return sheet.getRange(r.getRow(),sheet.getRange('Durations').getColumn());
}

/**
 * Get the cell of a row that corresponds to the laps/reps
 * 
 * @param r range
 */
function row_laps(r) {
  var sheet = r.getSheet();
  return sheet.getRange(r.getRow(),sheet.getRange('Reps').getColumn());
}

/**
 * Trigger 
 * @param e event 
 */  
function onEdit(e) {
  var range = e.range;
  Logger.log('Range ' + range.getA1Notation() +  ' was edited');
  if (range_is_laps(range)) {
    var laps = range.getValue();
    Logger.log('lap count is ' + laps);
    var p = pace(range);
    var dur = laps * p;
    Logger.log('duration is ' + dur);
    row_duration(range).setValue(dur);
  }
  if (range_is_duration(range)) {
    var dur = range.getValue();
    var p = pace(range);
    row_laps(range).setValue(dur/p);
  }
}
