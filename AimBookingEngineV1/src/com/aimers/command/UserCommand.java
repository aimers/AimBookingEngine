package com.aimers.command;

import java.sql.ResultSet;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;

public class UserCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("registerUser")){
			return registerUser(myInfo, dbcon);
		}else if(aimAction.equals("registerVendor")){
			return registerVendor(myInfo, dbcon);
		}
		
		return new JSONObject();

	}

	private Object getVendorRuleDetail(HashMap myInfo, ConnectionManager dbcon) {

		/* INPUTS: 
					"usrid": 32,
			        "rulid": 3,
			        "etyid": 1,
			        "etcid": 1,
			        "entid": 9

			       Rule can be set at type/category or id so category and id are optional
		 */
		String userid =  myInfo.get("usrid")+"";
		String rulid =  myInfo.get("rulid")+"";
		String etyid =  myInfo.get("etyid")+"";
		String etcid =  myInfo.get("etcid")+"";
		String entid =  myInfo.get("entid")+"";
		String stDate =  myInfo.get("stDate")+"";
		String enDate =  myInfo.get("enDate")+"";

		if(!rulid.equals("3")){
			JSONArray timeslots		= getTimeSlots(dbcon, userid, rulid, etyid, etcid, entid, stDate, enDate);
			JSONArray bookedslots	= getBookedSlots(dbcon, rulid, etyid, etcid, entid, stDate, enDate);
			return markSlotStatus(timeslots,bookedslots);
		}else{
			JSONArray ruleCharValues = getRuleChars(dbcon, userid, rulid, etyid, etcid, entid, stDate, enDate);
			return ruleCharValues;
			
		}
	}

	private JSONArray getRuleChars(ConnectionManager dbcon, String userid, String rulid, String etyid, String etcid,
			String entid, String stDate, String enDate) {

		JSONArray ruleDetails = new JSONArray();
		ResultSet rs=null;

		String query = "SELECT `vgrdt`.`VGDID`, "+
				" 	  `vgrdt`.`CHRID`, "+
				"     `vgrdt`.`UTYID`, "+
				"     `vgrdt`.`USRID`, "+
				"     `vgrdt`.`ETCID`, "+
				"     `vgrdt`.`ETYID`, "+
				"     `vgrdt`.`ACTIV`, "+
				"     `vgrdt`.`RULID`, "+
				"     `vgrdt`.`ENTID` "+
				"     FROM `bookingdb`.`vgrdt` where `vgrdt`.`USRID` = '"+userid+"' and "
						+" `vgrdt`.`ETYID` = '"+etyid+"' ";

		if(!etcid.equals("null")){
			query += " and `vgrdt`.`ETCID` = '"+etcid+"' ";
			if(!entid.equals("null")){
				query += " and `vgrdt`.`ENTID` = '"+entid+"' ";
			}
		}

		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			//TODO: ENTID must be checked against VEMP
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			ruleDetails = Convertor.convertToJSON(rs);

			return ruleDetails;
		}


		catch(Exception ex){
			System.out.println("Error from VENDOR Rule Chars Command "+ex +"==dbcon=="+dbcon);
			return ruleDetails;
		}
	}

	private JSONArray getBookedSlots(ConnectionManager dbcon, String rulid, String etyid, String etcid, String entid,
			String stDate, String enDate) {

		JSONArray ruleDetails = new JSONArray();
		ResultSet rs=null;

		String query = "SELECT "
				+ "`vtrmt`.`VTRMI`, "
				+ "	 `vtrmt`.`VSUID`, "
				+ "    `vtrmt`.`VUTID`, "
				+ "    `vtrmt`.`CUSID`, "
				+ "    `vtrmt`.`CUTID`, "
				+ "    `vtrmt`.`ENTID`, "
				+ "    `vtrmt`.`RULID`, "
				+ "    `vtrmt`.`BDTIM`, "
				+ "    `vtrmt`.`BTIMZ`, "
				+ "   `vtrmt`.`BOSTM`, "
				+ "   `vtrmt`.`BOETM`, "
				+ "   `vtrmt`.`RTYPE`, "
				+ "   `vtrmt`.`STATS`, "
				+ "   `vtrmt`.`ACTIV` "
				+ "FROM `bookingdb`.`vtrmt` where BDTIM >= STR_TO_DATE('"+stDate+"', '%d-%m-%Y') "
				+ "and BDTIM <= STR_TO_DATE('"+enDate+"', '%d-%m-%Y') ";


		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			//TODO: ENTID must be checked against VEMP
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			JSONArray bookedSlots = Convertor.convertToJSON(rs);

			return bookedSlots;
		}


		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return ruleDetails;
		}
	}

	private JSONArray getTimeSlots(ConnectionManager dbcon, String userid, String rulid,
			String etyid, String etcid, String entid, String stDate, String enDate) {

		JSONArray ruleDetails = new JSONArray();
		ResultSet rs=null;

		String query = "SELECT `vtrdt`.`VTRID`, "+
				" `vtrdt`.`UTYID`, "+
				" `vtrdt`.`USRID`, "+
				" `vtrdt`.`ENTID`, "+
				" `vtrdt`.`ETCID`, "+
				" `vtrdt`.`ETYID`, "+
				" `vtrdt`.`RULID`, "+
				" `vtrdt`.`DSTIM`, "+
				" `vtrdt`.`DETIM`, "+
				" `vtrdt`.`TIMZN`, "+
				" `vtrdt`.`OSTSL`, "+
				" `vtrdt`.`OETSL`, "+
				" `vtrdt`.`RECUR`, "+
				" `vtrdt`.`DAYS`, "+
				" `vtrdt`.`DESCR` "+
				" FROM `bookingdb`.`vtrdt` where `vtrdt`.`USRID` = '"+userid+"' and "
				+ " `vtrdt`.`RULID` = '"+rulid+"' and "
				+ " `vtrdt`.`ETYID` = '"+etyid+"' ";

		if(!etcid.equals("null")){
			query += " and `vtrdt`.`ETCID` = '"+etcid+"' ";
			if(!entid.equals("null")){
				query += " and `vtrdt`.`ENTID` = '"+entid+"' ";
			}
		}

		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			//TODO: ENTID must be checked against VEMP
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			JSONArray ruleDetailsJSON = Convertor.convertToJSON(rs);

			JSONArray timeSlots = Convertor.convertRulestoTimeSlots(ruleDetailsJSON,stDate, enDate);


			return timeSlots;
		}


		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return ruleDetails;
		}
	}

	private Object markSlotStatus(JSONArray timeSlots, JSONArray bookedSlots) {
		try{
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd h:m:s");
			SimpleDateFormat ndf = new SimpleDateFormat("EEE MMM d HH:mm:ss z yyyy");
			for(int rIndex=0;rIndex<timeSlots.length();rIndex++){
				JSONObject record = ((JSONObject) timeSlots.get(rIndex));
				JSONArray timeSlotsArray = 	(JSONArray) record.get("TimeSlots");
				for(int tIndex=0;tIndex<timeSlotsArray.length();tIndex++){
					JSONObject tSlot = ((JSONObject) timeSlotsArray.get(tIndex));
					tSlot.put("Status", 0);
					for(int bIndex=0;bIndex<bookedSlots.length();bIndex++){
						JSONObject bSlot = ((JSONObject) bookedSlots.get(bIndex));
						//Mon Jul 27 00:00:00 IST 2015
						//2015-07-29 00:00:00.0
						
						System.out.println(sdf.parse(bSlot.get("bdtim")+"").equals(ndf.parse(record.get("Date")+"")));
						
						if(sdf.parse(bSlot.get("bdtim")+"").equals(ndf.parse(record.get("Date")+""))){
							if(tSlot.get("start").equals(bSlot.get("bostm")+"")
									&& 	
									tSlot.get("end").equals(bSlot.get("boetm")+"")){
								tSlot.put("Status",  bSlot.get("stats")+"");
							}
						}

					}	
				}
			}
		}catch(Exception ex){

		}


		return timeSlots;
	}

	private Object registerVendor(HashMap myInfo, ConnectionManager dbcon) {
		//TODO: Consider filtering
		JSONArray vendorHeaderList 			= (JSONArray) getVendorHeaderList(myInfo, dbcon);
		JSONArray vendorAddressList 		= (JSONArray) getVendorAddressList(myInfo, dbcon);
		JSONArray vendorCharacteristics 	= (JSONArray) getVendorCharacteristics(myInfo, dbcon);
		JSONArray vendorRules 				= (JSONArray) getVendorRules(myInfo, dbcon);

		//STEP 3: return the combined result
		return formVendorDataResultEntities(vendorHeaderList, vendorAddressList, vendorCharacteristics, vendorRules);
	}

	private JSONArray getVendorRules(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("etyid")+"";
		String etcid =  myInfo.get("etcid")+"";
		String entid =  myInfo.get("entid")+"";
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			String query = " SELECT "+
					" `vrumt`.`VRMID`, "+
					" `vrumt`.`RULID`, "+
					" `vrumt`.`USRID`, "+
					" `rulmt`.`RSTXT`, "+
					" `rulmt`.`DESCR`, "+
					" `vrumt`.`ETYID`, "+
					" `vrumt`.`ETCID`, "+
					" `vrumt`.`ENTID` "+
					" FROM `bookingdb`.`vrumt` "+
					" left outer join `bookingdb`.`rulmt` on  "+
					" `vrumt`.`RULID` = `rulmt`.`RULID`  "+
					" where `rulmt`.`ACTIV` = 1 and `vrumt`.`ACTIV` = 1  and "
					+ " `VRUMT`.`ETYID` in ('"
					+etyid+"') ";
			
			if(!etcid.equals("null")){
				query += " and `VRUMT`.`ETCID` in ('"+etcid+"') ";
				if(!entid.equals("null")){
					query += " and `VRUMT`.`ENTID` in ('"+entid+"') ";
				}
			}
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Rules Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private JSONArray getVendorAddressList(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("etyid")+"";
		String etcid =  myInfo.get("etcid")+"";
		String entid =  myInfo.get("entid")+"";
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query =
			" SELECT `usrmt`.`USRID`, "+
			" `UADMP`.`PRIMR`, "+
			" `ADDMT`.`STRET`, "+
			" `ADDMT`.`LNDMK`, "+
			" `ADDMT`.`LOCLT`, "+
			" `ADDMT`.`CTYID`, "+
			" `ADDMT`.`PINCD`, "+
			" `ADDMT`.`LONGT`, "+
			" `ADDMT`.`LATIT` "+
			" FROM `BOOKINGDB`.`usrmt` "+ 
			"  left outer join "+
			" `BOOKINGDB`.`UETMP` "+
			"  on "+
			" `usrmt`.`USRID` = `UETMP`.`USRID` "+
			" left outer join "+
			" `BOOKINGDB`.`UADMP` "+
			" on "+
			" `usrmt`.`USRID` = `UADMP`.`USRID` "+
			" left outer join "+
			" `BOOKINGDB`.`ADDMT` "+
			" on "+
			" `ADDMT`.`ADRID` = `UADMP`.`ADRID` "+
			//" left outer join `BOOKINGDB`.`VEMPT`  "+
			//" on  `usrmt`.`USRID` = `VEMPT`.`USRID`   "+
			" where `UETMP`.ACTIV = 1 and `UETMP`.UTYID = 2 ";
			//+ "and "
			//		+ " `VEMPT`.`ETYID` in ('"
			//		+entid+"') ";
			
			/*if(!etcid.equals("null")){
				query += " and `VEMPT`.`ETCID` in ('"+etcid+"') ";
				if(!entid.equals("null")){
					query += " and `VEMPT`.`ENTID` in ('"+entid+"') ";
				}
			}*/
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Address Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object formVendorDataResultEntities(JSONArray vendorHeaderList, JSONArray vendorAddressList, 
			JSONArray vendorCharacteristics, JSONArray vendorRules) {
		JSONArray charValues = new JSONArray();
		JSONArray addValues = new JSONArray();
		JSONArray ruleValues = new JSONArray();
		for(int vIndex=0;vIndex<vendorHeaderList.length();vIndex++){
			try{
				charValues = new JSONArray();
				addValues  = new JSONArray();
				ruleValues  = new JSONArray();
				((JSONObject)vendorHeaderList.get(vIndex)).put("Characteristics", charValues);

				for(int cIndex=0;cIndex<vendorCharacteristics.length();cIndex++){

					if(
							((JSONObject)vendorHeaderList.get(vIndex)).get("usrid") 
							== 
							((JSONObject)vendorCharacteristics.get(cIndex)).get("usrid") 
							){
						JSONObject vendorChars = ((JSONObject)vendorCharacteristics.get(cIndex));
						charValues.put(vendorChars);

					}

				}

				((JSONObject)vendorHeaderList.get(vIndex)).put("Address", addValues);
				for(int cIndex=0;cIndex<vendorAddressList.length();cIndex++){

					if(
							((JSONObject)vendorHeaderList.get(vIndex)).get("usrid") 
							== 
							((JSONObject)vendorAddressList.get(cIndex)).get("usrid") 
							){
						JSONObject vendorAdds = ((JSONObject)vendorAddressList.get(cIndex));
						addValues.put(vendorAdds);

					}

				}
				((JSONObject)vendorHeaderList.get(vIndex)).put("Rules", ruleValues);
				for(int cIndex=0;cIndex<vendorRules.length();cIndex++){

					if(
							((JSONObject)vendorHeaderList.get(vIndex)).get("usrid") 
							== 
							((JSONObject)vendorRules.get(cIndex)).get("usrid") 
							){
						JSONObject vendorRule= ((JSONObject)vendorRules.get(cIndex));
						ruleValues.put(vendorRule);

					}

				}
			}catch(Exception ex){

			}
		}

		return vendorHeaderList;
	}

	private JSONArray getVendorCharacteristics(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("etyid")+"";
		String etcid =  myInfo.get("etcid")+"";
		String entid =  myInfo.get("entid")+"";
		
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query = "SELECT `UCHMT`.`USRID`, `CHRMT`.`CHRID`, `UCHMT`.`CHRID`, "
					+ "`UCHMT`.`VALUE`,  "
					+ "`CHRMT`.`DESCR`, `CHRMT`.`REGXT`, `CHRMT`.`MDTEXT`,  "
					+ "`CHRMT`.`LNTXT`, `CHRMT`.`SRTXT`  "
					+ " FROM `BOOKINGDB`.`UCHMT`    "    
					+ " left outer join      " 
					+ " `BOOKINGDB`.`CHRMT`  "       
					+ " on 	   "
					+ "  `UCHMT`.`CHRID` = `CHRMT`.`CHRID`  ";
					//+" left outer join `BOOKINGDB`.`VEMPT`  "
					//+" on  `UCHMT`.`USRID` = `VEMPT`.`USRID`  where "
					//+ " `VEMPT`.`ETYID` in ('"
					//+entid+"') ";
			/*if(!etcid.equals("null")){
				query += " and `VEMPT`.`ETCID` in ('"+etcid+"') ";
				if(!entid.equals("null")){
					query += " and `VEMPT`.`ENTID` in ('"+entid+"') ";
				}
			}*/
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Char Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private JSONArray getVendorHeaderList(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
		String etyid =  myInfo.get("etyid")+"";
		String etcid =  myInfo.get("etcid")+"";
		String entid =  myInfo.get("entid")+"";
		
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String query = 
					" SELECT `usrmt`.`USRID`, "+
							" `usrmt`.`URCOD`, "+
							" `usrmt`.`PRFIX`, "+
							" `usrmt`.`TITLE`, "+
							" `usrmt`.`FRNAM`, "+
							" `usrmt`.`LTNAM`, "+
							" `usrmt`.`URDOB`, "+
							" `usrmt`.`GENDR`, "+
							" `usrmt`.`DSPNM` "+
							" FROM `BOOKINGDB`.`usrmt` "+ 
							"  left outer join "+
							" `BOOKINGDB`.`UETMP` "+
							"  on "+
							" `usrmt`.`USRID` = `UETMP`.`USRID` "+
							" left outer join "+
							" `BOOKINGDB`.`UADMP` "+
							" on "+
							" `usrmt`.`USRID` = `UADMP`.`USRID` "+
							" left outer join `BOOKINGDB`.`VEMPT`  "+
							" on  `USRMT`.`USRID` = `VEMPT`.`USRID`   "+
					" where `UETMP`.ACTIV = 1 and `UETMP`.UTYID = 2 and "
					+ " `VEMPT`.`ETYID` in ('"
					+etyid+"') ";
					
					if(!etcid.equals("null")){
						query += " and `VEMPT`.`ETCID` in ('"+etcid+"') ";
						if(!entid.equals("null")){
							query += " and `VEMPT`.`ENTID` in ('"+entid+"') ";
						}
					}			
			
			
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object registerUser(HashMap myInfo, ConnectionManager dbcon) {
		/*
		 * 
		 * 




INSERT INTO `bookingdb`.`usrmt`
(`USRID`, `URCOD`, `PRFIX`, `TITLE`, `FRNAM`, `LTNAM`, `URDOB`, `GENDR`, `DSPNM`, `ACTIV`, 
`CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)
VALUES
(detailsJSON.USRID,
detailsJSON.URCOD,
detailsJSON.PRFIX,
detailsJSON.TITLE,
detailsJSON.FRNAM,
detailsJSON.LTNAM,
detailsJSON.URDOB,
detailsJSON.GENDR,
detailsJSON.DSPNM,
detailsJSON.ACTIV,
detailsJSON.CRTDT,
detailsJSON.CRTBY,
detailsJSON.CHNDT,
detailsJSON.CHNBY);

INSERT INTO `bookingdb`.`uetmp`
(`MPNID`, `UTYID`, `USRID`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)
VALUES
(mpnid,
detailsJSON.UTYID,
detailsJSON.USRID,
detailsJSON.ACTIV,
detailsJSON.CRTDT,
detailsJSON.CRTBY,
detailsJSON.CHNDT,
detailsJSON.CHNBY);


INSERT INTO `bookingdb`.`uchmt`
(`UCHID`, `CHRID`, `UTYID`, `USRID`, `VALUE`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)
VALUES
(charJSON.UCHID,
charJSON.CHRID,
detailsJSON.UTYID,
detailsJSON.USRID,
charJSON.VALUE,
charJSON.ACTIV,
charJSON.CRTDT,
charJSON.CRTBY,
charJSON.CHNDT,
charJSON.CHNBY);


INSERT INTO `bookingdb`.`uadmp`
(`MPNID`, `USRID`, `ADRID`, `PRIMR`, `ACTIV`, `CHNDT`, `CRTDT`, `CRTBY`, `CHNBY`)
VALUES
(mpnid,
detailsJSON.USRID,
adrid,
addJSON.PRIMR,
addJSON.ACTIV,
addJSON.CHNDT,
addJSON.CRTDT,
addJSON.CRTBY,
addJSON.CHNBY);

INSERT INTO `bookingdb`.`addmt`
(`ADRID`, `STRET`, `LNDMK`, `LOCLT`, `CTYID`, `PINCD`, `LONGT`, `LATIT`, 
`CHNDT`, `CRTDT`, `ACTIV`, `CHNBY`, `CRTBY`)
VALUES
(adrid,
addJSON.STREET,
addJSON.LNDMK,
addJSON.LOCLT,
addJSON.CTYID,
addJSON.PINCD,
addJSON.LONGT,
addJSON.LATIT,
addJSON.CHNDT,
addJSON.CRTDT,
addJSON.ACTIV,
addJSON.CHNBY,
addJSON.CRTBY);
		 */
		JSONArray userAccount = createUserAccount(myInfo, dbcon);
		return userAccount;
		
	}

	private JSONArray createUserAccount(HashMap myInfo, ConnectionManager dbcon) {
		
		//TODO: Send email
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			JSONArray responseArray = new JSONArray();
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			Date date = new Date();
			String newId = getNewUserID(dbcon);
			detailsJSON.put("USRID", newId);
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CRTBY", newId);
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", newId);
			if(!detailsJSON.has("UERPW")){
				detailsJSON.put("UERPW", detailsJSON.getString("USRID").hashCode()+"");
			}
			
			String query = "INSERT INTO `bookingdb`.`uacmt`"
					+ "(`USRID`, `USRNM`, `UERPW`,`ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ " VALUES "
					+ " ("
					+ "'"+detailsJSON.getString("USRID")+ "',"
					+ "'"+detailsJSON.getString("USRNM")+ "',"
					+ "'"+detailsJSON.getString("UERPW")+ "',"
					+ "'"+detailsJSON.getString("ACTIV")+ "',"
					+ "'"+detailsJSON.getString("CRTDT")+ "',"
					+ "'"+detailsJSON.getString("CRTBY")+ "',"
					+ "'"+detailsJSON.getString("CHNDT")+ "',"
					+ "'"+detailsJSON.getString("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				responseArray.put(detailsJSON);
			}else{
				//TODO: Consider Raising Error
				responseArray.put(new JSONObject(details));
			}
			
			return responseArray;

		}
		catch(Exception ex){
			System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private String getNewUserID(ConnectionManager dbcon) {
		
		ResultSet rs=null;
		try{
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			System.out.println("SELECT "+
					"MAX(`USRID`)+1"+
					" FROM `bookingdb`.`uacmt`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`USRID`)+1"+
					" FROM `bookingdb`.`uacmt`  ");
			if(rs.next()){
				return rs.getString(1);
			}
			return "";

		}
		catch(Exception ex){
			System.out.println("Error from USER next ID Command "+ex +"==dbcon=="+dbcon);
			return "";
		}
	}

	

	

}
