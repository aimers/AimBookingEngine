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
			//return registerUser(myInfo, dbcon);
		}else if(aimAction.equals("updateUser")){
			return updateUser(myInfo, dbcon);
		}else if(aimAction.equals("updateVendor")){
			//return registerUser(myInfo, dbcon);
		}else if(aimAction.equals("loginUser")){
			return loginUser(myInfo, dbcon);
		}
		
		return new JSONObject();

	}

/*CREATE USER METHODS START*/	
	private Object registerUser(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  createUserAccount(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  createUserMaster(myInfo, dbcon));
				myInfo.put("details",  createUserEntityMapping(myInfo, dbcon));
				if(detailsJSON.has("Characteristics")){
					myInfo.put("details",  createUserCharachteristics(myInfo, dbcon));
				}
				if(detailsJSON.has("Address")){
					myInfo.put("details",  createUserAddress(myInfo, dbcon));
				}
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	private Object createUserAddress(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			JSONArray addJSONArray = (JSONArray) detailsJSON.get("Address");
			JSONArray addOutJARRAY = new JSONArray();
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			int iAdridNext = getNextAdrid(dbcon);
			for(int cIndex=0;cIndex<addJSONArray.length();cIndex++){
				JSONObject addJSON = (JSONObject) addJSONArray.get(cIndex);
				addJSON.put("USRID", detailsJSON.get("USRID"));
				addJSON.put("ACTIV", detailsJSON.get("ACTIV"));
				addJSON.put("CRTDT", detailsJSON.get("CRTDT"));
				addJSON.put("CRTBY", detailsJSON.get("CRTBY"));
				addJSON.put("CHNDT", detailsJSON.get("CHNDT"));
				addJSON.put("CHNBY", detailsJSON.get("CHNBY"));
				
				String adrid = iAdridNext+"";
				iAdridNext++;

				//THINK IF WE NEED STATE AND COUNTRY DENORMALIZED!!
				String query1 = "INSERT INTO `bookingdb`.`addmt`"
						+ "(`ADRID`, `STREET`, `LNDMK`, `LOCLT`, `CTYID`, `PINCD`, `LONGT`, `LATIT`, "
						+ "`CHNDT`, `CRTDT`, `ACTIV`, `CHNBY`, `CRTBY`)"
						+ "VALUES "
						+ "( "
						+ "'"+adrid+ "', "
						+ "'"+addJSON.get("STREET")+ "', "
						+ "'"+addJSON.get("LNDMK")+ "', "
						+ "'"+addJSON.get("LOCLT")+ "', "
						+ "'"+addJSON.get("CTYID")+ "', "
						+ "'"+addJSON.get("PINCD")+ "', "
						+ "'"+addJSON.get("LONGT")+ "', "
						+ "'"+addJSON.get("LATIT")+ "', "
						+ "'"+addJSON.get("CHNDT")+ "', "
						+ "'"+addJSON.get("CRTDT")+ "', "
						+ "'"+addJSON.get("ACTIV")+ "', "
						+ "'"+addJSON.get("CHNBY")+ "', "
						+ "'"+addJSON.get("CRTBY")+ "' "
								+ ")";				
				String query2 = "INSERT INTO `bookingdb`.`uadmp`"
						+ "(`USRID`, `ADRID`, `PRIMR`, "
						+ "`ACTIV`, `CHNDT`, `CRTDT`, `CRTBY`, `CHNBY`) "
						+ "VALUES "
						+ "( "
						//+ "'"+uchid+ "',"//AI
						+ "'"+addJSON.get("USRID")+ "', "
						+ "'"+adrid+ "', "
						+ "'"+(addJSON.get("PRIMR")+"" == "true"? 1:0 )+ "', "
						+ "'"+addJSON.get("ACTIV")+ "', "
						+ "'"+addJSON.get("CHNDT")+ "', "
						+ "'"+addJSON.get("CRTDT")+ "', "
						+ "'"+addJSON.get("CRTBY")+ "', "
						+ "'"+addJSON.get("CHNBY")+ "')";
				

			
				System.out.println(query1);
				int rowCount1=dbcon.stm.executeUpdate(query1);
				System.out.println(query2);
				int rowCount2=dbcon.stm.executeUpdate(query2);
				if(rowCount1 > 0){
					addOutJARRAY.put(addJSON);
				}else{
					//TODO: Consider Raising Error
					addOutJARRAY.put((JSONObject) addJSONArray.get(cIndex));
				}
			}
			
			detailsJSON.put("Address",addOutJARRAY );
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object createUserCharachteristics(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			JSONArray charJSONArray = (JSONArray) detailsJSON.get("Characteristics");
			JSONArray charOutJARRAY = new JSONArray();
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			for(int cIndex=0;cIndex<charJSONArray.length();cIndex++){
				JSONObject charJSON = (JSONObject) charJSONArray.get(cIndex);
				charJSON.put("UTYID", detailsJSON.get("UTYID"));
				charJSON.put("USRID", detailsJSON.get("USRID"));
				charJSON.put("ACTIV", detailsJSON.get("ACTIV"));
				charJSON.put("CRTDT", detailsJSON.get("CRTDT"));
				charJSON.put("CRTBY", detailsJSON.get("CRTBY"));
				charJSON.put("CHNDT", detailsJSON.get("CHNDT"));
				charJSON.put("CHNBY", detailsJSON.get("CHNBY"));
				
				String query = "INSERT INTO `bookingdb`.`uchmt`"
						+ "( `CHRID`, `UTYID`, `USRID`, `VALUE`, "
						+ "`ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`) "
						+ "VALUES "
						+ "( "
						//+ "'"+uchid+ "',"//AI
						+ "'"+charJSON.get("CHRID")+ "', "
						+ "'"+charJSON.get("UTYID")+ "', "
						+ "'"+charJSON.get("USRID")+ "', "
						+ "'"+charJSON.get("VALUE")+ "', "
						+ "'"+charJSON.get("ACTIV")+ "', "
						+ "'"+charJSON.get("CRTDT")+ "', "
						+ "'"+charJSON.get("CRTBY")+ "', "
						+ "'"+charJSON.get("CHNDT")+ "', "
						+ "'"+charJSON.get("CHNBY")+ "')";

			
				System.out.println(query);
				int rowCount=dbcon.stm.executeUpdate(query);
				if(rowCount > 0){
					charOutJARRAY.put(charJSON);
				}else{
					//TODO: Consider Raising Error
					charOutJARRAY.put((JSONObject) charJSONArray.get(cIndex));
				}
			}
			
			detailsJSON.put("Characteristics",charOutJARRAY );
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object createUserEntityMapping(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			String mpnid = getNewTypeMapId(dbcon);
			String query = "INSERT INTO `bookingdb`.`uetmp`"
					+ "(`MPNID`, `UTYID`, `USRID`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ " VALUES "
					+ " ("
					+ "'"+mpnid+ "',"
					+ "'"+detailsJSON.get("UTYID")+ "',"
					+ "'"+detailsJSON.get("USRID")+ "',"
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object createUserMaster(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			String query = "INSERT INTO `bookingdb`.`usrmt`"
					+ "(`USRID`, `URCOD`, `PRFIX`, `TITLE`, `FRNAM`, `LTNAM`, "
					+ "`URDOB`, `GENDR`, `DSPNM`, `ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ " VALUES "
					+ " ("
					+ "'"+detailsJSON.get("USRID")+ "',"
					+ "'"+detailsJSON.get("USRID")+ "'," //URCOD???WHY IS THIS NEEDED
					+ "'"+detailsJSON.get("PRFIX")+ "',"
					+ "'"+detailsJSON.get("TITLE")+ "',"
					+ "'"+detailsJSON.get("FRNAM")+ "',"
					+ "'"+detailsJSON.get("LTNAM")+ "',"
					+ "'"+detailsJSON.get("URDOB")+ "',"
					+ "'"+detailsJSON.get("GENDR")+ "',"
					+ "'"+detailsJSON.get("DSPNM")+ "',"
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private JSONObject createUserAccount(HashMap myInfo, ConnectionManager dbcon) {
		
		//TODO: Send email
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
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
				detailsJSON.put("UERPW", detailsJSON.get("USRID").hashCode()+"");
			}
			
			String query = "INSERT INTO `bookingdb`.`uacmt`"
					+ "(`USRID`, `USRNM`, `UERPW`,`ACTIV`, `CRTDT`, `CRTBY`, `CHNDT`, `CHNBY`)"
					+ " VALUES "
					+ " ("
					+ "'"+detailsJSON.get("USRID")+ "',"
					+ "'"+detailsJSON.get("USRNM")+ "',"
					+ "'"+detailsJSON.get("UERPW")+ "',"
					+ "'"+detailsJSON.get("ACTIV")+ "',"
					+ "'"+detailsJSON.get("CRTDT")+ "',"
					+ "'"+detailsJSON.get("CRTBY")+ "',"
					+ "'"+detailsJSON.get("CHNDT")+ "',"
					+ "'"+detailsJSON.get("CHNBY")+ "')";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private String getNewTypeMapId(ConnectionManager dbcon) {
		
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
					"MAX(`MPNID`)+1"+
					" FROM `bookingdb`.`uetmp`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`MPNID`)+1"+
					" FROM `bookingdb`.`uetmp`  ");
			if(rs.next()){
				return rs.getString(1);
			}
			return "";

		}
		catch(Exception ex){
			System.out.println("Error from USER next type map ID Command "+ex +"==dbcon=="+dbcon);
			return "";
		}
	}
	private int getNextAdrid(ConnectionManager dbcon) {
		
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
					"MAX(`ADRID`)+1"+
					" FROM `bookingdb`.`addmt`  ");
			rs=dbcon.stm.executeQuery("SELECT "+
					"MAX(`ADRID`)+1"+
					" FROM `bookingdb`.`addmt`  ");
			if(rs.next()){
				return rs.getInt(1);
			}
			return 0;

		}
		catch(Exception ex){
			System.out.println("Error from adrid next ID Command "+ex +"==dbcon=="+dbcon);
			return 0;
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

	
/*CREATE USER METHODS END*/

/*UPDATE USER METHODS START*/	
	private Object updateUser(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  updateUserAccount(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  updateUserMaster(myInfo, dbcon));
				deleteUserEntityMapping(myInfo, dbcon);
				myInfo.put("details",  createUserEntityMapping(myInfo, dbcon));
				if(detailsJSON.has("Characteristics")){
					deleteUserCharachteristics(myInfo, dbcon);
					myInfo.put("details",  createUserCharachteristics(myInfo, dbcon));
				}
				if(detailsJSON.has("Address")){
					deleteUserAddress(myInfo, dbcon);
					myInfo.put("details",  createUserAddress(myInfo, dbcon));
				}
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	private void deleteUserAddress(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
//			String query1 = "DELETE FROM `bookingdb`.`addmt`"
//					+ " where `ADRID` in ( select `ADRID` from " 
//					+ " `bookingdb`.`uadmp` where `USRID` = '"+detailsJSON.get("USRID")+"' )";				
			String query2 = "DELETE FROM `bookingdb`.`uadmp` "
					+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";
//			System.out.println(query1);
//			int rowCount1=dbcon.stm.executeUpdate(query1);
			System.out.println(query2);
			int rowCount2=dbcon.stm.executeUpdate(query2);
				
			//return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			//return null;
		}
	}
	private void deleteUserCharachteristics(HashMap myInfo, ConnectionManager dbcon) {
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "DELETE FROM `bookingdb`.`uchmt`"
					+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			int rowCount1=dbcon.stm.executeUpdate(query1);
				
			//return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			//return null;
		}
	
		
	}
	private void deleteUserEntityMapping(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "DELETE FROM `bookingdb`.`uetmp`"
					+ " where `USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			int rowCount1=dbcon.stm.executeUpdate(query1);
				
			//return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			//return null;
		}
	}
	private Object updateUserMaster(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
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
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CRTBY", detailsJSON.get("USRID"));
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", detailsJSON.get("USRID"));
			if(!detailsJSON.has("UERPW")){
				detailsJSON.put("UERPW", detailsJSON.get("USRID").hashCode()+"");
			}
			String query = "UPDATE `bookingdb`.`usrmt`"
					+ " SET  "
					+ " `URCOD` = '"+detailsJSON.get("USRID")+ "', " //URCOD???WHY IS THIS NEEDED
					+ " `PRFIX` ='"+detailsJSON.get("PRFIX")+ "', "
					+ " `TITLE` = '"+detailsJSON.get("TITLE")+ "', "
					+ " `FRNAM` = '"+detailsJSON.get("FRNAM")+ "' ,"
					+ " `LTNAM` = '"+detailsJSON.get("LTNAM")+ "', "
					+ " `URDOB` = '"+detailsJSON.get("URDOB")+ "', "
					+ " `GENDR` = '"+(detailsJSON.get("GENDR")+"" == "true"? 1:0 )+ "', "
					+ " `DSPNM` = '"+detailsJSON.get("DSPNM")+ "', "
					+ " `ACTIV` = '"+detailsJSON.get("ACTIV")+ "', "
					+ " `CRTDT` = '"+detailsJSON.get("CRTDT")+ "', "
					+ " `CRTBY` = '"+detailsJSON.get("CRTBY")+ "', "
					+ " `CHNDT` = '"+detailsJSON.get("CHNDT")+ "', "
					+ " `CHNBY` = '"+detailsJSON.get("CHNBY")+ "' "
					+ " where `USRID` = '"+detailsJSON.get("USRID")+ "'";
					
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private JSONObject updateUserAccount(HashMap myInfo, ConnectionManager dbcon) {
		
		//TODO: Send email
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
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
			detailsJSON.put("ACTIV", 1+"");
			detailsJSON.put("CRTDT", dateFormat.format(date)+"");
			detailsJSON.put("CRTBY", detailsJSON.get("USRID"));
			detailsJSON.put("CHNDT", dateFormat.format(date)+"");
			detailsJSON.put("CHNBY", detailsJSON.get("USRID"));
			if(!detailsJSON.has("UERPW")){
				detailsJSON.put("UERPW", detailsJSON.get("USRID").hashCode()+"");
			}
			
			String query = "UPDATE `bookingdb`.`uacmt` set"
					+ "`USRNM` = '"+detailsJSON.get("USRNM")+ "', "
					+ "`UERPW` = '"+detailsJSON.get("UERPW")+ "', "
					+ "`ACTIV` = '"+detailsJSON.get("ACTIV")+ "', "
					+ "`CRTDT` = '"+detailsJSON.get("CRTDT")+ "', "
					+ "`CRTBY` = '"+detailsJSON.get("CRTBY")+ "',"
					+ "`CHNDT` = '"+detailsJSON.get("CHNDT")+ "', "
					+ "`CHNBY` = '"+detailsJSON.get("CHNBY")+ "' "
					+ " where `USRID` = '"+detailsJSON.get("USRID")+ "'";
			
			System.out.println(query);
			int rowCount=dbcon.stm.executeUpdate(query);
			if(rowCount > 0){
				return detailsJSON;
			}else{
				//TODO: Consider Raising Error
				return new JSONObject(details);
			}
			
			

		}
		catch(Exception ex){
			System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
		
/*UPDATE USER METHODS END*/	
	
/*SELECT USER METHODS START*/	
	@SuppressWarnings("unchecked")
	private Object loginUser(HashMap myInfo, ConnectionManager dbcon) {
		try{
			myInfo.put("details",  selectUserAccount(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  selectUserCharachteristics(myInfo, dbcon));
				myInfo.put("details",  selectUserAddress(myInfo, dbcon));
				
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}
	private Object selectUserAddress(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "SELECT `uadmp`.`MPNID`, `uadmp`.`USRID`,  `uadmp`.`ADRID`, "
					+ " `uadmp`.`PRIMR`, `addmt`.`STREET`, `addmt`.`LNDMK`, `addmt`.`LOCLT`,"
					+ " `addmt`.`CTYID`, `addmt`.`CNTRY`, `addmt`.`PINCD`, `addmt`.`LONGT`, "
					+ " `addmt`.`LATIT`, `uadmp`.`ACTIV`, `uadmp`.`CHNDT`, `uadmp`.`CRTDT`, "
					+ " `uadmp`.`CRTBY`, `uadmp`.`CHNBY` "
					+ " FROM `bookingdb`.`uadmp` left outer join `bookingdb`.`addmt` on "
					+ "`uadmp`.`ADRID` = `addmt`.`ADRID` "
					+ "where `USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			rs =dbcon.stm.executeQuery(query1);
			JSONArray addArray = Convertor.convertToJSON(rs);
			detailsJSON.put("Address", addArray);
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private Object selectUserCharachteristics(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			String query1 = "SELECT `UCHMT`.`USRID`, `CHRMT`.`CHRID`, `UCHMT`.`CHRID`, "
					+ "`UCHMT`.`VALUE`,  "
					+ "`CHRMT`.`DESCR`, `CHRMT`.`REGXT`, `CHRMT`.`MDTEXT`,  "
					+ "`CHRMT`.`LNTXT`, `CHRMT`.`SRTXT`  "
					+ " FROM `BOOKINGDB`.`UCHMT`    "    
					+ " left outer join      " 
					+ " `BOOKINGDB`.`CHRMT`  "       
					+ " on 	   "
					+ "  `UCHMT`.`CHRID` = `CHRMT`.`CHRID` "
					+ "where `UCHMT`.`USRID` = '"+detailsJSON.get("USRID")+"'";				
			System.out.println(query1);
			rs =dbcon.stm.executeQuery(query1);
			JSONArray addArray = Convertor.convertToJSON(rs);
			detailsJSON.put("Characteristics", addArray);
			return detailsJSON;

		}
		catch(Exception ex){
			System.out.println("Error from USER usermaster Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	private JSONObject selectUserAccount(HashMap myInfo, ConnectionManager dbcon) {
		//TODO: Send email
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			
			if(dbcon == null){
				try{
					dbcon.Connect("MYSQL");
				}
				catch(Exception ex){
					System.out.println(""+ex);
				}
			}
			
			String query = "SELECT `uacmt`.`USRID`,"
					+ " `uacmt`.`USRNM`,"
					+ " `uacmt`.`UERPW`, `usrmt`.`URCOD`, `usrmt`.`PRFIX`, `usrmt`.`TITLE`, "
					+ " `usrmt`.`FRNAM`, `usrmt`.`LTNAM`, `usrmt`.`URDOB`, `usrmt`.`GENDR`, "
					+ " `usrmt`.`DSPNM`, `uacmt`.`ACTIV`, `uacmt`.`CRTDT`, `uacmt`.`CRTBY`,"
					+ " `uacmt`.`CHNDT`, `uacmt`.`CHNBY` "
					+ " FROM `bookingdb`.`uacmt` left outer join "
					+ " `bookingdb`.`usrmt` on `uacmt`.`USRID` = `usrmt`.`USRID`"
					+ " where `uacmt`.`USRID` = "
					+ "'"+detailsJSON.get("USRID")+ "' "
					+ " and `uacmt`.`UERPW` = "
					+ "'"+detailsJSON.get("UERPW")+ "' ";
					
			System.out.println(query);
			rs=dbcon.stm.executeQuery(query);
			JSONArray userArray = Convertor.convertToJSON(rs);
			return userArray.getJSONObject(0).put("UTYID","2");
		}
		catch(Exception ex){
			System.out.println("Error from USER Command "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}
	
		
/*SELECT USER METHODS END*/	


}