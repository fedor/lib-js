function updateDOM(dst, src, opt={ keepAttributesIn: ['input'] }) {
	let { keepAttributesIn } = opt
	keepAttributesIn = keepAttributesIn || ['input']
	if (!Array.isArray(keepAttributesIn)) { keepAttributesIn = [keepAttributesIn] }
	keepAttributesIn = keepAttributesIn.map(i => i.toUpperCase())

	if (dst.nodeType !== src.nodeType) {
		dst.replaceWith(src)
		return
	}

	// Text
	if (dst.nodeType === 3) {
		if (dst.data !== src.data) { dst.data = src.data }
		return
	}

	// Tag
	if (dst.nodeType === 1) {
		// if tags are different, replace
		if (src.tagName !== dst.tagName) {
			dst.replaceWith(src)
			return
		}

		// if attr are different, replace 
		const allowAttrRemove = !keepAttributesIn.includes(src.tagName)
		const srcAttrNames = src.getAttributeNames()
		const dstAttrNames = dst.getAttributeNames()
		if (srcAttrNames.length > dstAttrNames.length) {
			for (let attrName of dstAttrNames) {
				if (!srcAttrNames.includes(attrName)) {
					if (allowAttrRemove) dst.removeAttribute(attrName)
				} else {
					if (src.getAttribute(attrName) !== dst.getAttribute(attrName)) {
						dst.setAttribute(attrName, src.getAttribute(attrName))
					}

					srcAttrNames.splice(srcAttrNames.indexOf(attrName), 1)
				}
			}

			for (let attrName of srcAttrNames) {
				dst.setAttribute(attrName, src.getAttribute(srcAttrNames))
			}
		} else {
			for (let attrName of srcAttrNames) {
				if (!dstAttrNames.includes(attrName)) {
					dst.setAttribute(attrName, src.getAttribute(attrName))
				} else {
					if (src.getAttribute(attrName) !== dst.getAttribute(attrName)) {
						dst.setAttribute(attrName, src.getAttribute(attrName))
					}

					dstAttrNames.splice(dstAttrNames.indexOf(attrName), 1)
				}
			}

			if (allowAttrRemove) {
				for (let attrName of dstAttrNames) {
					dst.removeAttribute(attrName)
				}
			}
		}

		// UPD dst.children
		const srcChildNodes = [...src.childNodes]
		const dstChildNodes = [...dst.childNodes]
		if (srcChildNodes.length > dstChildNodes.length) {
			let i = 0
			for (; i < dstChildNodes.length; i++) {
				updateDOM(dstChildNodes[i], srcChildNodes[i], opt)
			}
			for (; i < srcChildNodes.length; i++) {
				dst.appendChild(srcChildNodes[i])
			}
		} else {
			let i = 0
			for (; i < srcChildNodes.length; i++) {
				updateDOM(dstChildNodes[i], srcChildNodes[i], opt)
			}
			for (; i < dstChildNodes.length; i++) {
				dst.removeChild(dstChildNodes[i])
			}
		}
	}
}