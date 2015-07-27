package com.aimers.command;

import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;

public class VendorCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		String aimAction = (String) myInfo.get("AimAction");
		//STEP 2: goto respective methods base on subaction // TODO
		if(aimAction.equals("getVendorCategory")){
			return getVendorCategory(myInfo, dbcon);
		}else if(aimAction.equals("getVendorData")){
			return getVendorData(myInfo, dbcon);
		}else if(aimAction.equals("getVendorRuleDetail")){
			return getVendorRuleDetail(myInfo, dbcon);
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
				"     FROM `bookingdb`.`vgrdt` where `vgrdt`.`USRID` = \""+userid+"\" and "
						+" `vgrdt`.`ETYID` = \""+etyid+"\" ";

		if(!etcid.equals("null")){
			query += " and `vgrdt`.`ETCID` = \""+etcid+"\" ";
			if(!entid.equals("null")){
				query += " and `vgrdt`.`ENTID` = \""+entid+"\" ";
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
				" FROM `bookingdb`.`vtrdt` where `vtrdt`.`USRID` = \""+userid+"\" and "
				+ " `vtrdt`.`RULID` = \""+rulid+"\" and "
				+ " `vtrdt`.`ETYID` = \""+etyid+"\" ";

		if(!etcid.equals("null")){
			query += " and `vtrdt`.`ETCID` = \""+etcid+"\" ";
			if(!entid.equals("null")){
				query += " and `vtrdt`.`ENTID` = \""+entid+"\" ";
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
								tSlot.put("Status",  bSlot.get("status")+"");
							}
						}

					}	
				}
			}
		}catch(Exception ex){

		}


		return timeSlots;
	}

	private Object getVendorData(HashMap myInfo, ConnectionManager dbcon) {
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
					+ " `VRUMT`.`ETYID` in (\""
					+entid+"\") ";
			
			if(!etcid.equals("null")){
				query += " and `VRUMT`.`ETCID` in (\""+etcid+"\") ";
				if(!entid.equals("null")){
					query += " and `VRUMT`.`ENTID` in (\""+entid+"\") ";
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
			//		+ " `VEMPT`.`ETYID` in (\""
			//		+entid+"\") ";
			
			/*if(!etcid.equals("null")){
				query += " and `VEMPT`.`ETCID` in (\""+etcid+"\") ";
				if(!entid.equals("null")){
					query += " and `VEMPT`.`ENTID` in (\""+entid+"\") ";
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
					//+ " `VEMPT`.`ETYID` in (\""
					//+entid+"\") ";
			/*if(!etcid.equals("null")){
				query += " and `VEMPT`.`ETCID` in (\""+etcid+"\") ";
				if(!entid.equals("null")){
					query += " and `VEMPT`.`ENTID` in (\""+entid+"\") ";
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
					+ " `VEMPT`.`ETYID` in (\""
					+entid+"\") ";
					
					if(!etcid.equals("null")){
						query += " and `VEMPT`.`ETCID` in (\""+etcid+"\") ";
						if(!entid.equals("null")){
							query += " and `VEMPT`.`ENTID` in (\""+entid+"\") ";
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

	private Object getVendorCategory(HashMap myInfo, ConnectionManager dbcon) {
		JSONArray vendorCategoryList 			= (JSONArray) getVendorCategoryList(myInfo, dbcon);
		JSONArray vendorCharacteristics 		= (JSONArray) getVendorCategoryCharacteristics(myInfo, dbcon);

		//STEP 3: return the combined result
		return formVendorCategoryResultEntities(vendorCategoryList, vendorCharacteristics);
	}

	private Object formVendorCategoryResultEntities(JSONArray vendorList, JSONArray vendorCharacteristics) {
		JSONArray charValues = new JSONArray();

		for(int vIndex=0;vIndex<vendorList.length();vIndex++){
			try{
				charValues = new JSONArray();
				((JSONObject)vendorList.get(vIndex)).put("Characteristics", charValues);
				for(int cIndex=0;cIndex<vendorCharacteristics.length();cIndex++){

					if(
							((JSONObject)vendorList.get(vIndex)).get("entid") 
							== 
							((JSONObject)vendorCharacteristics.get(cIndex)).get("entid") 
							){
						JSONObject vendorChars = ((JSONObject)vendorCharacteristics.get(cIndex));
						charValues.put(vendorChars);

					}

				}
			}catch(Exception ex){

			}
		}

		return vendorList;
	}

	private Object getVendorCategoryCharacteristics(HashMap myInfo, ConnectionManager dbcon) {
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
					"`ECHMP`.`ENTID`, "+
					"`CHRMT`.`CHRID`, "+
					"`ECHMP`.`CHRID`, "+
					"`ECHMT`.`VALUE`, "+
					"`CHRMT`.`DESCR`, "+
					"`CHRMT`.`REGXT`, "+
					"`CHRMT`.`MDTEXT`, "+
					"`CHRMT`.`LNTXT`, "+
					"`CHRMT`.`SRTXT` "+
					"FROM `BOOKINGDB`.`ECHMP`  "+
					"     left outer join "+
					"     `BOOKINGDB`.`CHRMT`  "+
					"     on "+
					"	  `ECHMP`.`CHRID` = `CHRMT`.`CHRID` "+
					"     right join "+
					"     `BOOKINGDB`.`ECHMT`  "+
					"     on "+
					"		`ECHMP`.`MPNID` = `ECHMT`.`MPNID` "+
					" where `CHRMT`.`ACTIV` = 1 and `ECHMP`.`ACTIV` = 1 order by ENTID");
			rs=dbcon.stm.executeQuery("SELECT "+
					"`ECHMP`.`ENTID`, "+
					"`CHRMT`.`CHRID`, "+
					"`ECHMP`.`CHRID`, "+
					"`ECHMT`.`VALUE`, "+
					"`CHRMT`.`DESCR`, "+
					"`CHRMT`.`REGXT`, "+
					"`CHRMT`.`MDTEXT`, "+
					"`CHRMT`.`LNTXT`, "+
					"`CHRMT`.`SRTXT` "+
					"FROM `BOOKINGDB`.`ECHMP`  "+
					"     left outer join "+
					"     `BOOKINGDB`.`CHRMT`  "+
					"     on "+
					"	  `ECHMP`.`CHRID` = `CHRMT`.`CHRID` "+
					"     right join "+
					"     `BOOKINGDB`.`ECHMT`  "+
					"     on "+
					"		`ECHMP`.`MPNID` = `ECHMT`.`MPNID` "+
					" where `CHRMT`.`ACTIV` = 1 and `ECHMP`.`ACTIV` = 1 order by ENTID");
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

	private Object getVendorCategoryList(HashMap myInfo, ConnectionManager dbcon) {
		//Step 1: Read Intent, UserID
		String intent =  myInfo.get("INTENT").toString();
		String userid =  myInfo.get("UID").toString();
		//Step 2: Read Entities Based in Intent
		//TODO: add type and category 
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
			System.out.println("SELECT `ENTMT`.`ENTID`,"
					+"  `ENTMT`.`DESCR`,"
					+"    `ENTMT`.`ACTIV`,"
					+"    `ENTMT`.`CRTDT`,"
					+"   `ENTMT`.`CRTBY`,"
					+"   `ENTMT`.`CHNDT`,"
					+"   `ENTMT`.`CHNBY`"
					+" FROM `BOOKINGDB`.`ENTMT` where ENTID in ("
					+"		SELECT  ENTID FROM BOOKINGDB.IENMP where USRID = "+
					userid + " and INTID = "+ intent+" and ACTIV = 1"
					+" ) order by ENTID");
			rs=dbcon.stm.executeQuery("SELECT `ENTMT`.`ENTID`,"
					+"  `ENTMT`.`DESCR`,"
					+"    `ENTMT`.`ACTIV`,"
					+"    `ENTMT`.`CRTDT`,"
					+"   `ENTMT`.`CRTBY`,"
					+"   `ENTMT`.`CHNDT`,"
					+"   `ENTMT`.`CHNBY`"
					+" FROM `BOOKINGDB`.`ENTMT` where ENTID in ("
					+"		SELECT  ENTID FROM BOOKINGDB.IENMP where USRID = "+
					userid + " and INTID = "+ intent+" and ACTIV = 1 "
					+" ) order by ENTID");
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from VENDOR Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

}
