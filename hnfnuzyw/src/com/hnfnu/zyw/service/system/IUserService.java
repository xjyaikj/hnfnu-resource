package com.hnfnu.zyw.service.system;

import java.util.Map;

import com.hnfnu.zyw.dto.system.UserDto;
import com.hnfnu.zyw.dto.system.ValidateMessege;

public interface IUserService {
	public boolean add(UserDto user);

	public boolean delete(int id);

	public boolean update(UserDto user);

	public UserDto load(int id);

	/**
	 * 查询数据库所有记录,用Map装，方便用于分页显示
	 * 
	 * @return
	 */
	public Map<String, Object> list();
	
	//验证用户是否存在
	public ValidateMessege validateUser(UserDto user);
}
