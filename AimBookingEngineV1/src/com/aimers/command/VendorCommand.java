package com.aimers.command;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.aimers.dbaccess.ConnectionManager;
import com.aimers.utils.Convertor;

public class VendorCommand extends aimCommand {

	@SuppressWarnings("null")
	@Override
	public Object execute(HashMap myInfo, ConnectionManager dbcon) {
		// TODO Auto-generated method stub
		//STEP 1: get subaction info from myInfo // TODO
		
		//STEP 2: goto respective methods base on subaction // TODO
		
		return getVendorCategoryList(myInfo, dbcon);
		
		
		
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
						+"FROM `BOOKINGDB`.`ENTMT` where ENTID in ("
						+"		SELECT  ENTID FROM BOOKINGDB.IENMP where USRID = 0 and INTID = 1 and ACTIV = 1"
						+" )");
				rs=dbcon.stm.executeQuery("SELECT `ENTMT`.`ENTID`,"
						+"  `ENTMT`.`DESCR`,"
						+"    `ENTMT`.`ACTIV`,"
						+"    `ENTMT`.`CRTDT`,"
						+"   `ENTMT`.`CRTBY`,"
						+"   `ENTMT`.`CHNDT`,"
						+"   `ENTMT`.`CHNBY`"
						+"FROM `BOOKINGDB`.`ENTMT` where ENTID in ("
						+"		SELECT  ENTID FROM BOOKINGDB.IENMP where USRID = 0 and INTID = 1 and ACTIV = 1"
						+" )");
				return Convertor.convertToJSON(rs);

		}
		catch(Exception ex){
			System.out.println("Error from RHOD "+ex +"==dbcon=="+dbcon);
			return null;
		}
	}

}
