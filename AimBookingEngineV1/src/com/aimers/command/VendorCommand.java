package com.aimers.command;

import java.sql.ResultSet;
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
		}
		return new JSONObject();

	}

	private Object getVendorData(HashMap myInfo, ConnectionManager dbcon) {
		JSONArray vendorHeaderList 			= (JSONArray) getVendorHeaderList(myInfo, dbcon);
		JSONArray vendorCharacteristics 	= (JSONArray) getVendorCharacteristics(myInfo, dbcon);

		//STEP 3: return the combined result
		return formVendorDataResultEntities(vendorHeaderList, vendorCharacteristics);
	}

	private Object formVendorDataResultEntities(JSONArray vendorHeaderList, JSONArray vendorCharacteristics) {
		JSONArray charValues = new JSONArray();

		for(int vIndex=0;vIndex<vendorHeaderList.length();vIndex++){
			try{
				charValues = new JSONArray();
				((JSONObject)vendorHeaderList.get(vIndex)).put("Characteristics", charValues);
				for(int cIndex=0;cIndex<vendorCharacteristics.length();cIndex++){

					if(
							((JSONObject)vendorHeaderList.get(vIndex)).get("usrid") 
							== 
							((JSONObject)vendorCharacteristics.get(cIndex)).get("usrid") 
							){
						JSONObject vendorChars = ((JSONObject)vendorCharacteristics.get(cIndex));
						charValues.put(vendorChars);

					}else{
						charValues = new JSONArray();
					}

				}
			}catch(Exception ex){

			}
		}

		return vendorHeaderList;
	}

	private JSONArray getVendorCharacteristics(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		JSONArray vendorCharachterisitcs = new JSONArray();
		return vendorCharachterisitcs;
	}

	private JSONArray getVendorHeaderList(HashMap myInfo, ConnectionManager dbcon) {
		// TODO: Add skip/top
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
			System.out.println(
					" SELECT `usrmt`.`USRID`, "+
							" `usrmt`.`URCOD`, "+
							" `usrmt`.`PRFIX`, "+
							" `usrmt`.`TITLE`, "+
							" `usrmt`.`FRNAM`, "+
							" `usrmt`.`LTNAM`, "+
							" `usrmt`.`URDOB`, "+
							" `usrmt`.`GENDR`, "+
							" `usrmt`.`DSPNM`, "+
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
					" where `UETMP`.ACTIV = 1 and `UETMP`.UTYID = 2 ");
			rs=dbcon.stm.executeQuery(
					" SELECT `usrmt`.`USRID`, "+
							" `usrmt`.`URCOD`, "+
							" `usrmt`.`PRFIX`, "+
							" `usrmt`.`TITLE`, "+
							" `usrmt`.`FRNAM`, "+
							" `usrmt`.`LTNAM`, "+
							" `usrmt`.`URDOB`, "+
							" `usrmt`.`GENDR`, "+
							" `usrmt`.`DSPNM`, "+
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
					" where `UETMP`.ACTIV = 1 and `UETMP`.UTYID = 2 ");
			return Convertor.convertToJSON(rs);
		}
		catch(Exception ex){
			System.out.println("Error from RHOD "+ex +"==dbcon=="+dbcon);
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

					}else{
						charValues = new JSONArray();
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
			System.out.println("Error from RHOD "+ex +"==dbcon=="+dbcon);
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
					userid + " and INTID = "+ intent+" and ACTIV = 1 order by ENTID"
					+" )");
			rs=dbcon.stm.executeQuery("SELECT `ENTMT`.`ENTID`,"
					+"  `ENTMT`.`DESCR`,"
					+"    `ENTMT`.`ACTIV`,"
					+"    `ENTMT`.`CRTDT`,"
					+"   `ENTMT`.`CRTBY`,"
					+"   `ENTMT`.`CHNDT`,"
					+"   `ENTMT`.`CHNBY`"
					+" FROM `BOOKINGDB`.`ENTMT` where ENTID in ("
					+"		SELECT  ENTID FROM BOOKINGDB.IENMP where USRID = "+
					userid + " and INTID = "+ intent+" and ACTIV = 1 order by ENTID"
					+" )");
			return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from RHOD "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

}
