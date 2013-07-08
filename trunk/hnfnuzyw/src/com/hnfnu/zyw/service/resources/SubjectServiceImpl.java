package com.hnfnu.zyw.service.resources;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.hnfnu.zyw.dao.resources.ISubjectDao;
import com.hnfnu.zyw.dto.Resources.SubjectDto;

@Service("subjectService")
public class SubjectServiceImpl implements ISubjectService {

	@Autowired
	@Qualifier("subjectDao")
	public ISubjectDao subjectDao;

	public boolean add(SubjectDto subject) {
		try {
			subjectDao.add(subject);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean delete(int id) {
		try {
			subjectDao.delete(id);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean update(SubjectDto subject) {
		try {
			subjectDao.update(subject);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public SubjectDto load(int id) {
		try {
			return subjectDao.load(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public List<SubjectDto> list() {
		String hql = "from SubjectDto";
		List<SubjectDto> subjects = null;
		try {
			subjects = subjectDao.list(hql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return subjects;
	}

	public Map<String, Object> listSub() {
		String hql = "from SubjectDto";
		Map<String, Object> subjectList = new HashMap<String, Object>();
		List<SubjectDto> l = null;

		try {
			l = subjectDao.list(hql);
		} catch (Exception e) {
			e.printStackTrace();
		}
		subjectList.put("Rows", l);
		subjectList.put("Total", l.size());
		return subjectList;
	}

}
