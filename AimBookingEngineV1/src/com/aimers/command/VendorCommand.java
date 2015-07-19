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

		//STEP 2: goto respective methods base on subaction // TODO
		JSONArray vendorList 			= (JSONArray) getVendorCategoryList(myInfo, dbcon);
		JSONArray vendorCharacteristics = (JSONArray) getVendorCharacteristics(myInfo, dbcon);

		//STEP 3: return the combined result
		return formResultEntities(vendorList, vendorCharacteristics);


	}

	private Object formResultEntities(JSONArray vendorList, JSONArray vendorCharacteristics) {
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
						//						Iterator vendorKeys = vendorChars.keys();
						//						
						//						while(vendorKeys.hasNext()){
						//							String charKey = (String) vendorKeys.next();
						//							((JSONObject)vendorList.get(vIndex)).put(charKey , vendorChars.get(charKey));
						//							
						//						}
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

	private Object getVendorCharacteristics(HashMap myInfo, ConnectionManager dbcon) {
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
