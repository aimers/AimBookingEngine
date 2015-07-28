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
		}
		
		return new JSONObject();

	}

	
	private Object registerUser(HashMap myInfo, ConnectionManager dbcon) {
		/*






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
		try{
			myInfo.put("details",  createUserAccount(myInfo, dbcon));
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			if(detailsJSON.has("USRID")){
				myInfo.put("details",  createUserMaster(myInfo, dbcon));
				myInfo.put("details",  createUserEntityMapping(myInfo, dbcon));
				if(detailsJSON.has("Charachterisitics")){
					myInfo.put("details",  createUserCharachteristics(myInfo, dbcon));
				}
			}
		}catch(Exception ex){
			return new JSONObject();
		}
		
		return myInfo.get("details");
		
	}

	private Object createUserCharachteristics(HashMap myInfo, ConnectionManager dbcon) {
		
		
		ResultSet rs=null;
		try{
			String details 	=  myInfo.get("details")+"";
			JSONObject detailsJSON 	= new JSONObject(details);
			JSONArray charJSONArray = (JSONArray) detailsJSON.get("Charachterisitics");
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
						+ "'"+charJSON.getString("CHRID")+ "', "
						+ "'"+charJSON.getString("UTYID")+ "', "
						+ "'"+charJSON.getString("USRID")+ "', "
						+ "'"+charJSON.getString("VALUE")+ "', "
						+ "'"+charJSON.getString("ACTIV")+ "', "
						+ "'"+charJSON.getString("CRTDT")+ "', "
						+ "'"+charJSON.getString("CRTBY")+ "', "
						+ "'"+charJSON.getString("CHNDT")+ "', "
						+ "'"+charJSON.getString("CHNBY")+ "')";

			
				System.out.println(query);
				int rowCount=dbcon.stm.executeUpdate(query);
				if(rowCount > 0){
					charOutJARRAY.put(charJSON);
				}else{
					//TODO: Consider Raising Error
					charOutJARRAY.put((JSONObject) charJSONArray.get(cIndex));
				}
			}
			
			detailsJSON.put("Charachterisitics",charOutJARRAY );
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
					+ "'"+detailsJSON.getString("UTYID")+ "',"
					+ "'"+detailsJSON.getString("USRID")+ "',"
					+ "'"+detailsJSON.getString("ACTIV")+ "',"
					+ "'"+detailsJSON.getString("CRTDT")+ "',"
					+ "'"+detailsJSON.getString("CRTBY")+ "',"
					+ "'"+detailsJSON.getString("CHNDT")+ "',"
					+ "'"+detailsJSON.getString("CHNBY")+ "')";
					
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
					+ "'"+detailsJSON.getString("USRID")+ "',"
					+ "'"+detailsJSON.getString("USRID")+ "'," //URCOD???WHY IS THIS NEEDED
					+ "'"+detailsJSON.getString("PRFIX")+ "',"
					+ "'"+detailsJSON.getString("TITLE")+ "',"
					+ "'"+detailsJSON.getString("FRNAM")+ "',"
					+ "'"+detailsJSON.getString("LTNAM")+ "',"
					+ "'"+detailsJSON.getString("URDOB")+ "',"
					+ "'"+detailsJSON.getString("GENDR")+ "',"
					+ "'"+detailsJSON.getString("DSPNM")+ "',"
					+ "'"+detailsJSON.getString("ACTIV")+ "',"
					+ "'"+detailsJSON.getString("CRTDT")+ "',"
					+ "'"+detailsJSON.getString("CRTBY")+ "',"
					+ "'"+detailsJSON.getString("CHNDT")+ "',"
					+ "'"+detailsJSON.getString("CHNBY")+ "')";
					
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
