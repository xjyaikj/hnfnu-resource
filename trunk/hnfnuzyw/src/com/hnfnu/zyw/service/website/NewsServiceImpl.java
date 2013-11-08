package com.hnfnu.zyw.service.website;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.hnfnu.zyw.dao.website.INewsDao;
import com.hnfnu.zyw.dto.website.NewsDto;

@Service("newsService")
public class NewsServiceImpl implements INewsService {

	@Autowired
	@Qualifier("newsDao")
	public INewsDao newsDao;

	/**
	 * 增加一个新闻
	 * @param 一个新闻对象
	 * @return 成功返回true，失败返回false
	 */
	public boolean add(NewsDto function) {
		try {
			newsDao.add(function);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 删除一个新闻
	 * @param 要删除的新闻的id
	 * @return 成功返回true，失败返回false
	 */
	public boolean delete(NewsDto function) {
		try {
			newsDao.delete(function.getId());
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 更新一个新闻
	 * @param 已经更新的新闻的对象
	 * @return 成功返回true，失败返回false
	 */
	public boolean update(NewsDto function) {
		try {
			newsDao.update(function);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 读取一个新闻
	 * @param 读取的新闻的id
	 * @return 返回读取的新闻对象
	 */
	public NewsDto load(NewsDto function) {
		try {
			return newsDao.load(function.getId());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取所有新闻
	 * @return 获取到的新闻集合
	 */
	public List<NewsDto> list() {
		String hql = "from NewsDto";
		List<NewsDto> functions = null;
		try {
			functions = newsDao.list(hql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return functions;
	}

	/**
	 * 列出所有的新闻
	 * @return 保存了所有新闻的Map
	 */
	public Map<String, Object> listFun() {
		String hql = "from NewsDto";
		Map<String, Object> functionList = new HashMap<String, Object>();
		List<NewsDto> l = null;
		
		try {
			l = newsDao.list(hql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		functionList.put("Rows", l);
		functionList.put("Total", l.size());
		return functionList;
	}
}
