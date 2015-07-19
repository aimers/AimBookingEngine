package com.aimers.dbaccess;

import java.sql.*;


public class ConnectionManager{

			public Connection con=null;
			public Statement stm=null;
			public ResultSet rs=null;

	public Boolean Connect(String dbaccess){
			try{

				Class.forName("com.mysql.jdbc.Driver").newInstance();//sun.jdbc.odbc.JdbcOdbcDriver");
				if(dbaccess.equals("MYSQL")){
					//TODO: Replace hardcoding with properties parameters
					con=DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/BOOKINGDB","root","sa");
				}
				try {
					con.createStatement().executeQuery(
							"Select count(*) from `INTYMT`");//TODO: Replace with table
				} catch (Exception e) {
					e.printStackTrace();
					try {
						Class.forName("com.mysql.jdbc.Driver").newInstance();
					} catch (InstantiationException e1) {
						e1.printStackTrace();
					} catch (IllegalAccessException e1) {
						e1.printStackTrace();
					}
					con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306","root","sa");
				}
				stm=con.createStatement();
			}
			catch(Exception ex){
				return false;
			}
			return true;
	}
	public Boolean Close(String dbaccess){
			try{

				if(dbaccess.equals("MYSQL")){
					con.close();
					con=null;
				}
				stm=null;
				rs=null;
			}
			catch(Exception ex){
				return false;
			}
			return true;
	}

}